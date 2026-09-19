import { useEffect, useRef, useState } from 'react'
import * as Y from 'yjs'

type CollaborativeEditorProps = {
    doc: Y.Doc
}

/**
 * Binds a textarea to a Y.Text.
 *
 * The document is the source of truth. The textarea is a view of it, and every
 * keystroke is turned into the smallest edit that explains the difference,
 * rather than replacing the whole string: replacing would read as "deleted
 * everything and typed it again", which destroys concurrent edits and throws
 * away the caret.
 */
export function CollaborativeEditor({ doc }: CollaborativeEditorProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const [text, setText] = useState(() => doc.getText('content').toString())

    useEffect(() => {
        const ytext = doc.getText('content')

        function handleChange() {
            const next = ytext.toString()
            const el = textareaRef.current

            // A remote edit before the caret shifts everything after it, so the
            // caret has to move by the same amount or it drifts backwards
            // through the text while someone else types above.
            if (el && document.activeElement === el) {
                const start = el.selectionStart
                const delta = next.length - el.value.length
                const before = el.value.slice(0, start)
                const stillThere = next.slice(0, start) === before

                setText(next)

                queueMicrotask(() => {
                    if (!textareaRef.current) return
                    const at = stillThere ? start : Math.max(0, start + delta)
                    textareaRef.current.setSelectionRange(at, at)
                })
                return
            }

            setText(next)
        }

        ytext.observe(handleChange)
        setText(ytext.toString())

        return () => {
            ytext.unobserve(handleChange)
        }
    }, [doc])

    function handleInput(event: React.ChangeEvent<HTMLTextAreaElement>) {
        const ytext = doc.getText('content')
        const before = ytext.toString()
        const after = event.target.value

        if (before === after) return

        // Find the shared head and tail, so what is left in the middle is the
        // actual edit. One keystroke then becomes one insert of one character,
        // which is what the CRDT needs to merge properly.
        let head = 0
        while (head < before.length && head < after.length && before[head] === after[head]) {
            head++
        }

        let tail = 0
        while (
            tail < before.length - head &&
            tail < after.length - head &&
            before[before.length - 1 - tail] === after[after.length - 1 - tail]
        ) {
            tail++
        }

        const removed = before.length - head - tail
        const inserted = after.slice(head, after.length - tail)

        doc.transact(() => {
            if (removed > 0) ytext.delete(head, removed)
            if (inserted) ytext.insert(head, inserted)
        })
    }

    return (
        <textarea
            ref={textareaRef}
            value={text}
            onChange={handleInput}
            spellCheck={false}
            className="h-full w-full resize-none bg-canvas p-4 font-mono text-[13.5px] leading-relaxed text-heading outline-none"
        />
    )
}
