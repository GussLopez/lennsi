export default function FormMessage({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="text-sm text-destructive"
    >
      {message}
    </p>
  )
}
