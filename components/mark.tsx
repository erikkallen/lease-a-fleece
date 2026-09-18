/**
 * The Lease-a-Fleece mark: a folded fleece whose curled corner also reads as a
 * contract page. The dotted inset hem is the blanket-stitch edging carried over
 * from the real product. Strokes use currentColor so the mark inherits context.
 */
export function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 300 300"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M 52 74 Q 52 52 74 52 H 164 Q 248 52 248 136 V 226 Q 248 248 226 248 H 74 Q 52 248 52 226 Z"
        strokeWidth={15}
        strokeLinejoin="round"
      />
      <path d="M 164 52 Q 164 136 248 136" strokeWidth={15} strokeLinecap="round" />
      <path
        d="M 82 84 H 152 M 82 84 V 218 M 82 218 H 218 M 218 218 V 158"
        strokeWidth={9}
        strokeLinecap="round"
        strokeDasharray="1 22"
      />
    </svg>
  )
}
