/* ============================================================
   GOLDEN PIZZA CAFE — AUTH
   Uses Supabase Authentication (email + password). Passwords are
   never handled or stored by this app directly — Supabase Auth
   owns that entirely. When Supabase isn't configured yet, a
   lightweight local "demo session" is used instead so the rest
   of the site (My Orders, checkout) remains testable.
   ============================================================ */

async function handleSignup(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const phone = form.phone.value.trim();
  const password = form.password.value;
  const confirm = form.confirm.value;
  const errorEl = document.querySelector("[data-auth-error]");
  errorEl.textContent = "";

  if (!name || !email || !phone || !password) {
    errorEl.textContent = "Please fill in every field.";
    return;
  }
  if (password.length < 6) {
    errorEl.textContent = "Password must be at least 6 characters.";
    return;
  }
  if (password !== confirm) {
    errorEl.textContent = "Passwords do not match.";
    return;
  }

  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb.auth.signUp({
      email,
      password,
      options: { data: { full_name: name, phone } }
    });
    if (error) {
      errorEl.textContent = error.message;
      return;
    }
    // Create/upsert profile row (RLS: users can update their own profile)
    if (data.user) {
      await sb.from("profiles").upsert({ id: data.user.id, full_name: name, phone, email });
    }
    showToast("Account created — check your email to confirm, then log in.");
    setTimeout(() => (window.location.href = "login.html"), 1200);
  } else {
    localStorage.setItem("gpc_demo_user", JSON.stringify({ name, email, phone }));
    showToast("Demo account created (connect Supabase for real accounts)");
    setTimeout(() => (window.location.href = "index.html"), 1000);
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const form = e.target;
  const email = form.email.value.trim();
  const password = form.password.value;
  const errorEl = document.querySelector("[data-auth-error]");
  errorEl.textContent = "";

  const sb = getSupabase();
  if (sb) {
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) {
      errorEl.textContent = error.message;
      return;
    }
    showToast("Welcome back!");
    setTimeout(() => (window.location.href = "index.html"), 700);
  } else {
    const demo = JSON.parse(localStorage.getItem("gpc_demo_user") || "null");
    if (!demo || demo.email !== email) {
      errorEl.textContent = "No demo account found — sign up first (or connect Supabase).";
      return;
    }
    localStorage.setItem("gpc_demo_session", "1");
    showToast("Welcome back!");
    setTimeout(() => (window.location.href = "index.html"), 700);
  }
}

async function handleLogout() {
  const sb = getSupabase();
  if (sb) await sb.auth.signOut();
  localStorage.removeItem("gpc_demo_session");
  window.location.href = "login.html";
}
window.handleLogout = handleLogout;

async function currentUserLabel() {
  const sb = getSupabase();
  if (sb) {
    const { data } = await sb.auth.getUser();
    if (data?.user) return data.user.user_metadata?.full_name || data.user.email;
    return null;
  }
  if (localStorage.getItem("gpc_demo_session")) {
    const demo = JSON.parse(localStorage.getItem("gpc_demo_user") || "null");
    return demo?.name || "Account";
  }
  return null;
}

document.addEventListener("DOMContentLoaded", async () => {
  document.querySelector("[data-signup-form]")?.addEventListener("submit", handleSignup);
  document.querySelector("[data-login-form]")?.addEventListener("submit", handleLogin);
  document.querySelectorAll("[data-logout]").forEach((el) => el.addEventListener("click", handleLogout));

  const label = await currentUserLabel();
  document.querySelectorAll("[data-account-label]").forEach((el) => {
    el.textContent = label ? label.split(" ")[0] : "Login";
    el.setAttribute("href", label ? "orders.html" : "login.html");
  });
});
