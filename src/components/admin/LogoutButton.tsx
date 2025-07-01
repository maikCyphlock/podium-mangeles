'use client';
export function LogoutButton() {
  const handleLogout = async () => {
    await fetch('/admin/api/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
    >
      Logout
    </button>
  );
}