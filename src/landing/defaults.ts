const rich = (parts: { text: string; bold?: boolean }[]) => ({ root: {
  type: 'root', version: 1, direction: 'ltr', format: '', indent: 0,
  children: [{ type: 'paragraph', version: 1, direction: 'ltr', format: '', indent: 0, children:
    parts.map(({ text, bold }) => ({ type: 'text', version: 1, text, format: bold ? 1 : 0, detail: 0, mode: 'normal', style: '' })),
  }],
} })

export const defaultLayout = [
  { blockType: 'header', visible: true, brand: 'payway', links: [
    { label: 'Soluciones de cobro', url: '#soluciones-de-cobro' }, { label: 'Servicios adicionales' }, { label: 'Ayuda' }, { label: 'Noticias' },
  ], actions: [{ label: 'Ingresá' }, { label: 'Registrate' }] },
  { blockType: 'payments', visible: true, title: 'Nos adaptamos a tu manera de cobrar', items: [{ title: 'Terminal' }, { title: 'QR que acepta…' }] },
  { blockType: 'business', visible: true, title: '¡Tenés todo\nsolucionado!', items: [
    { text: rich([{ text: 'No importa el tamaño de tu comercio.' }]) },
    { text: rich([{ text: 'Cobrá ' }, { text: 'rápido', bold: true }, { text: ', recibí ' }, { text: 'antes el dinero', bold: true }, { text: ' de tus ventas y ' }, { text: 'controlá tu negocio', bold: true }, { text: ' desde un solo lugar.' }]) },
    { text: rich([{ text: 'Sumate a ' }, { text: 'Payway', bold: true }, { text: ' y potenciá tus ' }, { text: 'ventas.', bold: true }]) },
  ], button: { label: 'Registrate en Payway' } },
  { blockType: 'kit', visible: true, title: 'Conocé el kit de soluciones Payway', items: [
    { title: 'Terminales inteligentes', description: 'Cobrás rápido y sencillo.' },
    { title: 'Cobros con QR', description: 'Aceptás todos los medios de pago.' },
    { title: 'Cobro Anticipado', description: 'Recibís el dinero de tus ventas en 24 horas hábiles.' },
    { title: 'Gestión del negocio', description: 'Administrás tu comercio desde cualquier lugar.' },
  ] },
  { blockType: 'benefits', visible: true, title: 'Brindá estos beneficios a tus clientes y ¡hacela simple!', items: [
    { title: 'Vendé en Cuotas y con programa Cuotas MiPyME', description: 'Conocé más sobre nuestros programas de Cuotas' },
    { title: 'Ofrecé retiro de efectivo en tu local', description: 'Conocé más sobre retiro de efectivo' },
    { title: 'Cobrá con Dólar turista a clientes del exterior', description: 'Conocé más sobre Dólar turista' },
  ], button: { label: 'Registrate en Payway' } },
  { blockType: 'stats', visible: true, title: 'Payway en cifras', items: [
    { value: '+ de 100', label: 'Medios de pago' }, { value: '+ 350 mil', label: 'Comercios del país' },
    { value: '+ 3700', label: 'Operaciones por minuto' }, { value: '+ de 160', label: 'Partners nos acompañan' },
  ] },
  { blockType: 'footer', visible: true, brand: 'payway', socials: ['LinkedIn', 'Instagram', 'YouTube'].map(label => ({ label })),
    appsTitle: 'Descargá la app', apps: ['Google Play', 'App Store'].map(label => ({ label })),
    columns: [
      { title: 'Soluciones de cobro', items: ['Con terminal de cobro', 'Con código QR', 'Online', 'Con link de pago', 'Por teléfono', 'Con débito automático', 'Desarrolladores'].map(label => ({ label })) },
      { title: 'Acerca de', items: ['Seguridad en las ventas', 'Comisiones', 'Noticias', 'Trabajá en Payway', 'Convertite en proveedor', 'Legales', 'Soluciones para ONG', 'Partners'].map(label => ({ label })) },
      { title: 'Ayuda', items: ['Centro de ayuda', 'Convertite en cliente 0810-666-4888', 'Atención a comercios 0810-666-4888', 'Soporte 0810-666-4888', 'WhatsApp +54 9 11 5910 3194'].map(label => ({ label })) },
    ], legal: 'Payway S.A.U. Lavardén 247 (C1437FBE), CABA, Argentina\nCUIT:30-71766440-6. Derechos reservados.',
  },
]
