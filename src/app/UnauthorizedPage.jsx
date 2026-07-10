export default function UnauthorizedPage() {
  return (
    <div className="flex h-[70vh] items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-red-600">403</h1>
        <p className="mt-3 text-lg font-medium">
          You don't have permission to access this page.
        </p>
      </div>
    </div>
  );
}