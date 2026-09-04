'use client';

import * as React from 'react';
import {
  useForm as _useForm,
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z, ZodType } from 'zod';
import { cn } from '@/lib/utils';
import { motion, type Variants } from 'framer-motion';
import { AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';

export { useController, zodResolver };

export function useZodForm<TSchema extends ZodType>(
  schema: TSchema,
  options?: Omit<
    Parameters<typeof _useForm<z.infer<TSchema>>>[0],
    'resolver'
  >,
) {
  return _useForm<z.infer<TSchema>>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    shouldUnregister: false,
    ...options,
  });
}

interface FormRootProps<TFieldValues extends FieldValues>
  extends React.FormHTMLAttributes<HTMLFormElement> {
  form: ReturnType<typeof _useForm<TFieldValues>>;
  children: React.ReactNode;
}

export function FormRoot<TFieldValues extends FieldValues>({
  form,
  children,
  className,
  onSubmit,
  ...props
}: FormRootProps<TFieldValues>) {
  return (
    <form
      noValidate
      className={cn('space-y-5', className)}
      {...props}
      onSubmit={(event) => {
        event.stopPropagation();
        event.preventDefault();
        if (onSubmit) {
          onSubmit(event);
        } else {
          void form.handleSubmit(
            () => {},
            (err) => {
              console.debug('[auth/form] validation errors:', err);
            },
          )(event);
        }
      }}
    >
      {children}
    </form>
  );
}

interface FieldControlProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  render: (props: {
    field: ReturnType<typeof useController<TFieldValues, TName>>['field'];
    fieldState: ReturnType<typeof useController<TFieldValues, TName>>['fieldState'];
    invalid: boolean;
  }) => React.ReactNode;
}

export function FieldControl<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ control, name, render }: FieldControlProps<TFieldValues, TName>) {
  const { field, fieldState } = useController({ control, name });
  const invalid = Boolean(fieldState.invalid || fieldState.error);
  return <>{render({ field, fieldState, invalid })}</>;
}

const messageVariants: Variants = {
  hidden: { opacity: 0, y: -4, height: 0 },
  visible: { opacity: 1, y: 0, height: 'auto' },
};

interface FieldMessageProps {
  type?: 'error' | 'success' | 'hint';
  children: React.ReactNode;
  className?: string;
}

export function FieldMessage({ type = 'error', children, className }: FieldMessageProps) {
  if (!children) return null;
  const toneMap = {
    error: 'text-destructive dark:text-red-400',
    success: 'text-emerald-600 dark:text-emerald-400',
    hint: 'text-muted-foreground',
  } as const;
  const Icon = type === 'error' ? AlertCircle : type === 'success' ? CheckCircle2 : null;
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={messageVariants}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'flex items-center gap-1.5 text-[11.5px] font-medium pt-1.5',
        toneMap[type],
        className,
      )}
    >
      {Icon ? <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden /> : null}
      <span className="leading-snug break-words">{children}</span>
    </motion.div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  onSuffixClick?: () => void;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid = false, prefixIcon, suffixIcon, onSuffixClick, ...props },
  ref,
) {
  return (
    <div className="relative group">
      {prefixIcon ? (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground/80">
          {prefixIcon}
        </div>
      ) : null}
      <input
        ref={ref}
        className={cn(
          'flex h-11 w-full rounded-xl border bg-background/60 dark:bg-obsidian-950/60 px-3.5 py-2.5 text-sm text-foreground shadow-sm transition-all duration-200',
          'placeholder:text-muted-foreground/60',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/60 focus-visible:border-brand-500/60',
          'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60',
          prefixIcon ? 'pl-10' : '',
          suffixIcon && !onSuffixClick ? 'pr-10' : suffixIcon && onSuffixClick ? 'pr-12' : '',
          invalid
            ? 'border-destructive/70 dark:border-red-500/70 ring-1 ring-destructive/30 focus-visible:ring-destructive/50'
            : 'border-border/80 dark:border-white/10 hover:border-border dark:hover:border-white/20',
          className,
        )}
        {...props}
      />
      {suffixIcon ? (
        <div
          className={cn(
            'absolute inset-y-0 right-0 flex items-center pr-3.5 text-muted-foreground/70',
            onSuffixClick
              ? 'cursor-pointer hover:text-foreground transition-colors rounded-r-xl'
              : 'pointer-events-none',
          )}
          onClick={onSuffixClick}
          role={onSuffixClick ? 'button' : undefined}
          tabIndex={onSuffixClick ? 0 : undefined}
        >
          {suffixIcon}
        </div>
      ) : null}
    </div>
  );
});

type PasswordInputProps = Omit<InputProps, 'type' | 'suffixIcon' | 'onSuffixClick'>;

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput({ className, ...props }, ref) {
    const [show, setShow] = React.useState(false);
    return (
      <Input
        ref={ref}
        type={show ? 'text' : 'password'}
        autoComplete="current-password"
        suffixIcon={
          show ? (
            <EyeOff className="w-[18px] h-[18px]" strokeWidth={2} aria-hidden />
          ) : (
            <Eye className="w-[18px] h-[18px]" strokeWidth={2} aria-hidden />
          )
        }
        onSuffixClick={() => setShow((s) => !s)}
        className={className}
        {...props}
      />
    );
  },
);

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  optional?: boolean;
}

export function Label({ className, required, optional, children, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        'flex items-center gap-1 text-[13px] font-semibold font-heading text-foreground/90 leading-none pb-2 select-none',
        className,
      )}
      {...props}
    >
      {children}
      {required ? <span className="text-brand-600 dark:text-brand-400">*</span> : null}
      {optional ? (
        <span className="ml-1 text-[10.5px] font-mono font-normal text-muted-foreground/70 uppercase tracking-wider">
          Optional
        </span>
      ) : null}
    </label>
  );
}

interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'checked'> {
  label: React.ReactNode;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export function Checkbox({
  className,
  label,
  id,
  checked,
  onCheckedChange,
  ...props
}: CheckboxProps) {
  const uid = React.useId();
  const inputId = id ?? uid;
  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onCheckedChange?.(e.target.checked);
    },
    [onCheckedChange],
  );
  return (
    <label
      htmlFor={inputId}
      className="flex items-start gap-2.5 cursor-pointer select-none group"
    >
      <span className="relative inline-flex items-center justify-center pt-0.5">
        <input
          id={inputId}
          type="checkbox"
          className={cn('peer sr-only', className)}
          checked={checked}
          onChange={handleChange}
          {...props}
        />
        <span className="w-4.5 h-4.5 mt-0.5 rounded-md border border-border/90 dark:border-white/15 bg-background/60 dark:bg-obsidian-950/60 transition-all duration-200 peer-checked:bg-brand-600 peer-checked:border-brand-600 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500/50 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background dark:peer-focus-visible:ring-offset-obsidian-950 peer-disabled:opacity-60 peer-disabled:cursor-not-allowed grid place-items-center shadow-sm">
          <svg
            viewBox="0 0 16 16"
            width="12"
            height="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white opacity-0 group-has-[input:checked]:opacity-100 transition-opacity duration-200 scale-0 group-has-[input:checked]:scale-100"
          >
            <path d="M3 8.3l2.8 2.8L12.5 4" />
          </svg>
        </span>
      </span>
      <span className="text-[13px] leading-snug text-muted-foreground/90">{label}</span>
    </label>
  );
}
