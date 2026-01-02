// schemas/createTicketSchema.ts

// Opciones simuladas (en una app real podrían venir de una API)
const areaOptions = [
  { label: 'Tecnología (TI)', value: 'area-ti' },
  { label: 'Mantenimiento', value: 'area-mant' },
  { label: 'Transporte', value: 'area-trans' },
  { label: 'Compras', value: 'area-comp' },
]

const prioridadOptions = [
  { label: 'Baja', value: 'Baja' },
  { label: 'Media', value: 'Media' },
  { label: 'Alta', value: 'Alta' },
  { label: 'Urgente', value: 'Urgente' },
]

// Tipos dependientes (simulados)
const tiposMap: Record<string, { label: string, value: string }[]> = {
  'area-ti': [
    { label: 'Soporte PC / Laptop', value: 'tipo-1' },
    { label: 'Acceso a Sistemas / VPN', value: 'tipo-2' },
    { label: 'Instalación de Software', value: 'tipo-3' }
  ],
  'area-mant': [
    { label: 'Reparación Aire Acondicionado', value: 'tipo-4' },
    { label: 'Electricidad / Iluminación', value: 'tipo-5' }
  ],
  'area-trans': [
    { label: 'Solicitud de Vehículo', value: 'tipo-6' },
    { label: 'Mantenimiento Vehicular', value: 'tipo-7' }
  ],
  'area-comp': [
    { label: 'Insumos de Oficina', value: 'tipo-8' },
    { label: 'Mobiliario', value: 'tipo-9' }
  ]
}

// Función para generar el schema reactivo (recibe el estado actual del form si es necesario)
export const createTicketSchema = (formData: any) => [
  {
    $el: 'div',
    attrs: { class: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
    children: [
      {
        $formkit: 'select',
        name: 'AreaId',
        label: 'Área',
        placeholder: 'Selecciona el área',
        options: areaOptions,
        validation: 'required',
        // Clases DaisyUI
        labelClass: 'label-text font-bold mb-1 block',
        inputClass: 'select select-bordered w-full focus:select-primary',
      },
      {
        $formkit: 'select',
        name: 'Prioridad',
        label: 'Prioridad',
        options: prioridadOptions,
        value: 'Media',
        validation: 'required',
        labelClass: 'label-text font-bold mb-1 block',
        inputClass: 'select select-bordered w-full focus:select-primary',
      }
    ]
  },
  {
    $formkit: 'select',
    name: 'TipoSolicitudId',
    label: 'Tipo de Solicitud',
    placeholder: 'Selecciona el tipo de problema',
    // Lógica dinámica: Las opciones dependen del AreaId seleccionado
    options: formData.AreaId ? (tiposMap[formData.AreaId] || []) : [],
    disabled: !formData.AreaId,
    validation: 'required',
    labelClass: 'label-text font-bold mb-1 block',
    inputClass: 'select select-bordered w-full focus:select-primary disabled:bg-base-200 disabled:text-base-content/30',
    help: !formData.AreaId ? 'Selecciona primero un área arriba' : '',
    helpClass: 'label-text-alt text-error mt-1'
  },
  {
    $formkit: 'text',
    name: 'Asunto',
    label: 'Asunto',
    placeholder: 'Breve título del problema',
    validation: 'required|length:5,100',
    labelClass: 'label-text font-bold mb-1 block',
    inputClass: 'input input-bordered w-full focus:input-primary placeholder:text-base-content/30',
  },
  {
    $formkit: 'textarea',
    name: 'Descripcion',
    label: 'Descripción Detallada',
    placeholder: 'Explica qué sucede...',
    validation: 'required|length:10,1000',
    rows: '4',
    labelClass: 'label-text font-bold mb-1 block',
    inputClass: 'textarea textarea-bordered w-full focus:textarea-primary text-base placeholder:text-base-content/30 h-32',
  },
  {
    $formkit: 'file',
    name: 'ArchivoAdjunto',
    label: 'Evidencia (Opcional)',
    accept: '.pdf,.jpg,.png',
    classes: {
      label: 'label-text font-bold mb-1 block',
      input: 'file-input file-input-bordered w-full focus:file-input-primary text-sm',
      
      // Aquí ocultas la lista de texto
      fileList: 'hidden',
      fileItem: 'hidden',
      noFiles: 'hidden'
    }
  }
]