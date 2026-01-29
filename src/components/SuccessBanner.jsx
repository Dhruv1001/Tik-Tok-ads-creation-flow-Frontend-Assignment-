export default function SuccessBanner({ message }) {
  if (!message) return null;
  return <div className="banner success">{message}</div>;
}
