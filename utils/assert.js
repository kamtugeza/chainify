export function assert (predicate, message, Exception = Error) {
  if (!predicate) throw Exception(message)
}