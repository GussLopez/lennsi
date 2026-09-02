export default function FormMessage({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="text-xs font-medium text-destructive"
    >
      {message}
    </p>
  )
}
