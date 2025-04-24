import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-blue-700 text-center">
        📋 Memo & Invoice Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
        <Link
          href="/memo"
          className="block bg-white rounded-lg p-6 shadow hover:shadow-lg transition border hover:border-blue-500"
        >
          <h2 className="text-xl font-semibold text-blue-600 mb-2">
            📝 Manage Memos
          </h2>
          <p className="text-gray-600">Create, view, edit, and download memos.</p>
        </Link>

        <Link
          href="/invoice"
          className="block bg-white rounded-lg p-6 shadow hover:shadow-lg transition border hover:border-green-500"
        >
          <h2 className="text-xl font-semibold text-green-600 mb-2">
            📦 Manage Invoices
          </h2>
          <p className="text-gray-600">Work with invoices and download reports.</p>
        </Link>
      </div>
    </div>
  );
}
