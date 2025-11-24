'use client'

import { useEffect } from 'react'

interface ErrorProps {
  error: Error
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="border p-4">
      <div className="text-red-700 font-medium">Falha: {error.message}</div>
      <div className="flex items-center mt-2">
        <a
          href="https://github.com/bklieger-groq/stockbot-on-groq/issues"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm text-red-800 hover:text-red-900"
        >
          Actualize a página ou crie nova converça. caso se repita por favor
          <span className="ml-1" style={{ textDecoration: 'underline' }}>
            {' '}
            Reporte-nos o erro.
          </span>
        </a>
      </div>
    </div>
  )
}
