'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form'
import { CircleAlert, CircleCheck, TriangleAlert } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'

export type FormStatusValue = 'error' | 'warning' | 'success' | null | undefined

// The canonical shadcn form: react-hook-form + zod + @hookform/resolvers.
// `Form` is just FormProvider — wire your form with useForm({ resolver:
// zodResolver(schema) }) and spread the returned methods. `FormField` is a
// thin Controller wrapper that publishes the field name on context so the
// label / control / description / message parts can derive their ids and
// error state without prop-drilling.
const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue)

function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ ...props }: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

function useFormField() {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)

  if (!fieldContext?.name) {
    throw new Error('useFormField should be used within <FormField>')
  }

  const { getFieldState } = useFormContext()
  const formState = useFormState({ name: fieldContext.name })
  const fieldState = getFieldState(fieldContext.name, formState)
  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue)

type FormItemProps = React.ComponentProps<'div'> & {
  label?: string
  required?: boolean
  description?: string
  status?: FormStatusValue
  help?: string
  layout?: 'vertical' | 'horizontal'
  labelWidth?: string
}

function FormItem({
  className,
  label,
  required,
  description,
  status,
  help,
  layout = 'vertical',
  labelWidth,
  children,
  ...props
}: FormItemProps) {
  const id = React.useId()
  const isHorizontal = layout === 'horizontal'

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        data-uipkge=""
        data-slot="form-item"
        className={cn(
          'grid gap-1.5',
          isHorizontal && 'grid-cols-[var(--label-width,140px)_1fr] items-start gap-x-4 gap-y-0',
          className,
        )}
        style={labelWidth ? ({ '--label-width': labelWidth } as React.CSSProperties) : undefined}
        {...props}
      >
        {(label || required) && (
          <div className="flex items-center gap-1">
            {label && (
              <Label htmlFor={`${id}-form-item`} className={cn(status === 'error' && 'text-destructive')}>
                {label}
              </Label>
            )}
            {required && (
              <span className="text-destructive text-sm" aria-hidden="true">
                *
              </span>
            )}
          </div>
        )}
        <div
          className={cn(
            'space-y-1',
            status === 'error' &&
              '[&_input]:border-destructive [&_textarea]:border-destructive [&_button]:border-destructive',
            status === 'warning' && '[&_input]:border-warning [&_textarea]:border-warning [&_button]:border-warning',
            status === 'success' && '[&_input]:border-success [&_textarea]:border-success [&_button]:border-success',
          )}
        >
          {children}
          {description && <p className="text-muted-foreground text-xs">{description}</p>}
          {help && (
            <p
              role={status === 'error' ? 'alert' : undefined}
              className={cn(
                'text-xs',
                status === 'error' && 'text-destructive',
                status === 'warning' && 'text-warning',
                status === 'success' && 'text-success',
                !status && 'text-muted-foreground',
              )}
            >
              {help}
            </p>
          )}
        </div>
      </div>
    </FormItemContext.Provider>
  )
}

function FormLabel({ className, ...props }: React.ComponentProps<typeof Label>) {
  const { error, formItemId } = useFormField()

  return (
    <Label
      data-uipkge=""
      data-slot="form-label"
      data-error={!!error}
      className={cn('data-[error=true]:text-destructive', className)}
      htmlFor={formItemId}
      {...props}
    />
  )
}

function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      data-uipkge=""
      data-slot="form-control"
      id={formItemId}
      aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
      aria-invalid={!!error}
      {...props}
    />
  )
}

function FormDescription({ className, ...props }: React.ComponentProps<'p'>) {
  const { formDescriptionId } = useFormField()

  return (
    <p
      data-uipkge=""
      data-slot="form-description"
      id={formDescriptionId}
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

function FormMessage({ className, ...props }: React.ComponentProps<'p'>) {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message ?? '') : props.children

  if (!body) {
    return null
  }

  return (
    <p
      data-uipkge=""
      data-slot="form-message"
      id={formMessageId}
      role="alert"
      className={cn('text-destructive text-sm', className)}
      {...props}
    >
      {body}
    </p>
  )
}

function FormSection({
  className,
  title,
  subtitle,
  description,
  divider,
  headingLevel: Heading = 'h4',
  children,
  ...props
}: React.ComponentProps<'div'> & {
  title?: string
  subtitle?: string
  description?: string
  divider?: boolean
  headingLevel?: 'h2' | 'h3' | 'h4' | 'h5'
}) {
  return (
    <div data-uipkge="" data-slot="form-section" className={cn('space-y-3', className)} {...props}>
      {(divider || title || subtitle) && (
        <div className={cn(divider && 'border-t pt-4')}>
          {(title || subtitle) && (
            <div className="space-y-1">
              {title && <Heading className="text-sm font-semibold">{title}</Heading>}
              {subtitle && <p className="text-muted-foreground text-xs">{subtitle}</p>}
            </div>
          )}
        </div>
      )}
      {description && <p className="text-muted-foreground text-xs">{description}</p>}
      {children}
    </div>
  )
}

function FormActions({
  className,
  align = 'right',
  gap = 'md',
  ...props
}: React.ComponentProps<'div'> & {
  align?: 'left' | 'center' | 'right'
  gap?: 'sm' | 'md' | 'lg'
}) {
  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  }
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4',
  }

  return (
    <div
      data-uipkge=""
      data-slot="form-actions"
      className={cn('flex flex-wrap items-center', alignClasses[align], gapClasses[gap], className)}
      {...props}
    />
  )
}

const statusConfig = {
  error: {
    icon: CircleAlert,
    container: 'bg-destructive/10 text-destructive border-destructive/20',
  },
  warning: {
    icon: TriangleAlert,
    container: 'bg-warning/10 text-warning border-warning/30',
  },
  success: {
    icon: CircleCheck,
    container: 'bg-success/10 text-success border-success/30',
  },
} as const

function FormStatus({
  className,
  status,
  message,
  ...props
}: React.ComponentProps<'div'> & {
  status: NonNullable<FormStatusValue>
  message: string
}) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div
      data-uipkge=""
      data-slot="form-status"
      role={status === 'error' ? 'alert' : 'status'}
      className={cn('flex items-center gap-2 rounded-md border px-3 py-2 text-sm', config.container, className)}
      {...props}
    >
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </div>
  )
}

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  FormSection,
  FormActions,
  FormStatus,
}
