import dynamic from "next/dynamic";

const FinanzasApp = dynamic(() => import("../components/FinanzasApp"), {
  ssr: false,
  loading: () => (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      background: "#FAF8F4",
      fontFamily: "system-ui, sans-serif",
      color: "#8A8A8A",
      fontSize: 14,
    }}>
      Cargando Flore...
    </div>
  ),
});

export default function Home() {
  return <FinanzasApp />;
}