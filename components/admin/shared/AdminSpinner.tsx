export function AdminSpinner() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        minHeight: 200,
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "3px solid rgba(220,38,38,0.2)",
          borderTopColor: "#dc2626",
          animation: "spin 0.8s linear infinite",
        }}
      />
    </div>
  );
}
