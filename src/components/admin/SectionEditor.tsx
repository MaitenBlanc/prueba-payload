'use client'

import { BlocksField, useField, useForm } from '@payloadcms/ui'
import type { BlocksFieldClientComponent } from 'payload'
import { useEffect, useId, useState } from 'react'

const labels: Record<string, string> = {
  header: 'Marca y menú', payments: 'Formas de cobro', business: 'Todo solucionado',
  kit: 'Kit de soluciones', benefits: 'Beneficios', stats: 'Cifras', footer: 'Pie de página',
}

export const SectionEditor: BlocksFieldClientComponent = (props) => {
  const path = props.path || props.field.name
  const { rows = [], errorPaths = [] } = useField({ path, hasRows: true })
  const { dispatchFields } = useForm()
  const [selectedID, setSelectedID] = useState<string | null>(null)
  const id = `sections-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const overview = selectedID === 'overview'
  const index = Math.max(0, rows.findIndex(row => row.id === selectedID))
  const selected = rows[index]

  useEffect(() => {
    if (!overview && selected?.collapsed) {
      dispatchFields({ type: 'SET_ROW_COLLAPSED', path,
        updatedRows: rows.map(row => row.id === selected.id ? { ...row, collapsed: false } : row),
      })
    }
  }, [overview, selected, rows, path, dispatchFields])

  function showOverview() {
    setSelectedID('overview')
    dispatchFields({ type: 'SET_ALL_ROWS_COLLAPSED', path,
      updatedRows: rows.map(row => ({ ...row, collapsed: true })),
    })
  }

  return <div id={id} className="landing-section-editor">
    <nav className="section-editor-nav" aria-label="Elegir sección de inicio">
      {rows.map((row, i) => {
        const errors = errorPaths.filter(errorPath => errorPath.startsWith(`${path}.${i}.`)).length
        return <button type="button" key={row.id} aria-pressed={!overview && index === i}
          onClick={() => setSelectedID(row.id)}>
          {labels[row.blockType || ''] || `Sección ${i + 1}`}
          {errors > 0 && <span className="section-editor-errors"> ({errors})</span>}
        </button>
      })}
      <button type="button" aria-pressed={overview} onClick={showOverview}>Ordenar / agregar secciones</button>
    </nav>
    <p className="section-editor-help">{overview
      ? 'Arrastrá las secciones para cambiar su orden o agregá una nueva. Elegí una sección arriba para editarla.'
      : 'Editá esta sección y cambiá a otra sin perder lo escrito. Guardar borrador o publicar aplica los cambios de toda la página.'}</p>
    {!overview && rows.length > 0 && <style>{`
      #${id} > .blocks-field > .blocks-field__rows > div[id]:not([id="${path.replaceAll('.', '-')}-row-${index}"]) { display: none; }
      #${id} > .blocks-field > .blocks-field__header .blocks-field__header-actions,
      #${id} > .blocks-field > .blocks-field__drawer-toggler { display: none; }
    `}</style>}
    <BlocksField {...props} field={{ ...props.field, admin: { ...props.field.admin, initCollapsed: props.field.admin?.initCollapsed === true, isSortable: overview } }} />
  </div>
}
