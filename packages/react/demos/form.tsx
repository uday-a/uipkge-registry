import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Story from "../../components/story/Story";
import {
  Form,
  FormActions,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormSection,
  FormStatus,
} from "@react-registry/form";
import { Input } from "@react-registry/input";
import { Checkbox } from "@react-registry/checkbox";
import { Switch } from "@react-registry/switch";
import { Button } from "@react-registry/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@react-registry/select";
import { Textarea } from "@react-registry/textarea";
import {
  PinInput,
  PinInputGroup,
  PinInputSlot,
} from "@react-registry/pin-input";
import {
  Loader2,
  CheckCircle2,
  KeyRound,
  Smartphone,
  Mail,
  AlertCircle,
} from "lucide-react";

// The React form is the canonical shadcn form: react-hook-form + zod via
// @hookform/resolvers. `Form` is FormProvider — wire a form with
// useForm({ resolver: zodResolver(schema) }) and spread it. `FormField` is a
// Controller render-prop; FormItem / FormLabel / FormControl / FormMessage /
// FormDescription derive ids and error state from context.

// ── Login ─────────────────────────────────────────────────────────────────────
const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Min 8 characters"),
});
type LoginValues = z.infer<typeof loginSchema>;

function LoginForm() {
  const [loginError, setLoginError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(value: LoginValues) {
    setLoginError("");
    setLoginSuccess(false);
    await new Promise((r) => setTimeout(r, 1500));
    if (value.email === "error@demo.com")
      setLoginError("Invalid email or password");
    else setLoginSuccess(true);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-sm space-y-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  showPasswordToggle
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox />
            Remember me
          </label>
          <a href="#" className="text-primary text-sm hover:underline">
            Forgot password?
          </a>
        </div>

        {loginError && <p className="text-destructive text-sm">{loginError}</p>}
        {loginSuccess && (
          <p className="text-sm text-emerald-600">
            Login successful! Redirecting...
          </p>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting && (
            <Loader2 className="mr-2 size-4 animate-spin" />
          )}
          {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </Form>
  );
}

// ── Sign Up — 1 Column ────────────────────────────────────────────────────────
const signupSchema = z
  .object({
    fullName: z.string().min(1, "Required"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "Must contain at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
type SignupValues = z.infer<typeof signupSchema>;

function SignupForm() {
  const [success, setSuccess] = useState(false);
  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit() {
    await new Promise((r) => setTimeout(r, 1500));
    setSuccess(true);
  }

  if (success) {
    return (
      <div className="flex max-w-sm flex-col items-center gap-3 rounded-lg border p-6 text-center">
        <CheckCircle2 className="size-10 text-emerald-500" />
        <h3 className="text-lg font-semibold">Account created</h3>
        <p className="text-muted-foreground text-sm">
          Check your email to verify your account.
        </p>
        <Button variant="outline" size="sm" onClick={() => setSuccess(false)}>
          Back to form
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-sm space-y-4"
      >
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Jane Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="jane@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Min 8 characters"
                  showPasswordToggle
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Must contain at least 8 characters, one number and one symbol.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Repeat password"
                  showPasswordToggle
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <label className="flex items-start gap-2 text-sm">
          <Checkbox className="mt-0.5" />
          <span>
            I agree to the{" "}
            <a href="#" className="text-primary hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-primary hover:underline">
              Privacy Policy
            </a>
          </span>
        </label>
        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting && (
            <Loader2 className="mr-2 size-4 animate-spin" />
          )}
          {form.formState.isSubmitting
            ? "Creating account..."
            : "Create account"}
        </Button>
      </form>
    </Form>
  );
}

// ── Sign Up — 2 Column ────────────────────────────────────────────────────────
const signup2Schema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
  password: z.string().min(8, "Min 8 characters"),
  confirm: z.string(),
});
type Signup2Values = z.infer<typeof signup2Schema>;

function Signup2Form() {
  const form = useForm<Signup2Values>({
    resolver: zodResolver(signup2Schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirm: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() => {})}
        className="max-w-2xl space-y-4"
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Jane" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="jane@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" showPasswordToggle {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm</FormLabel>
                <FormControl>
                  <Input type="password" showPasswordToggle {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <label className="flex items-start gap-2 text-sm">
          <Checkbox className="mt-0.5" />I agree to the Terms and Privacy Policy
        </label>
        <div className="flex justify-end">
          <Button type="submit">Create account</Button>
        </div>
      </form>
    </Form>
  );
}

// ── Profile Edit — 1 Column ───────────────────────────────────────────────────
const profileSchema = z.object({
  displayName: z.string().optional(),
  email: z.string().email("Enter a valid email").or(z.literal("")),
  phone: z.string().optional(),
  bio: z.string().optional(),
  country: z.string().optional(),
});
type ProfileValues = z.infer<typeof profileSchema>;

function ProfileForm() {
  const [success, setSuccess] = useState(false);
  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: "",
      email: "",
      phone: "",
      bio: "",
      country: "",
    },
  });

  async function onSubmit() {
    await new Promise((r) => setTimeout(r, 1200));
    setSuccess(true);
  }

  if (success) {
    return (
      <div className="flex max-w-md flex-col items-center gap-3 rounded-lg border p-6 text-center">
        <CheckCircle2 className="size-10 text-emerald-500" />
        <h3 className="text-lg font-semibold">Profile updated</h3>
        <Button variant="outline" size="sm" onClick={() => setSuccess(false)}>
          Edit again
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-md space-y-4"
      >
        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Name</FormLabel>
              <FormControl>
                <Input placeholder="Jane Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input type="tel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  rows={3}
                  placeholder="Tell us about yourself"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="de">Germany</SelectItem>
                    <SelectItem value="jp">Japan</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <Switch defaultChecked />
            Email notifications
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Switch />
            Marketing emails
          </label>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && (
              <Loader2 className="mr-2 size-4 animate-spin" />
            )}
            {form.formState.isSubmitting ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

// ── Password Reset (two-step) ─────────────────────────────────────────────────
const resetRequestSchema = z.object({
  email: z.string().email("Enter a valid email"),
});
const resetConfirmSchema = z
  .object({
    newPassword: z.string().min(8, "Min 8 characters"),
    confirmNew: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmNew, {
    message: "Passwords do not match",
    path: ["confirmNew"],
  });
type ResetRequestValues = z.infer<typeof resetRequestSchema>;
type ResetConfirmValues = z.infer<typeof resetConfirmSchema>;

function PasswordResetForm() {
  const [step, setStep] = useState<"request" | "confirm">("request");
  const [success, setSuccess] = useState(false);

  const requestForm = useForm<ResetRequestValues>({
    resolver: zodResolver(resetRequestSchema),
    defaultValues: { email: "" },
  });
  const confirmForm = useForm<ResetConfirmValues>({
    resolver: zodResolver(resetConfirmSchema),
    defaultValues: { newPassword: "", confirmNew: "" },
  });

  async function onRequest() {
    await new Promise((r) => setTimeout(r, 1200));
    setStep("confirm");
  }
  async function onConfirm() {
    await new Promise((r) => setTimeout(r, 1200));
    setSuccess(true);
  }

  if (success) {
    return (
      <div className="flex max-w-sm flex-col items-center gap-3 rounded-lg border p-6 text-center">
        <CheckCircle2 className="size-10 text-emerald-500" />
        <h3 className="text-lg font-semibold">Password updated</h3>
        <p className="text-muted-foreground text-sm">
          You can now sign in with your new password.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setStep("request");
            setSuccess(false);
          }}
        >
          Back
        </Button>
      </div>
    );
  }

  if (step === "request") {
    return (
      <div className="max-w-sm space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Reset password</h3>
          <p className="text-muted-foreground mt-1 mb-4 text-sm">
            Enter your email and we'll send you a reset link.
          </p>
        </div>
        <Form {...requestForm}>
          <form
            onSubmit={requestForm.handleSubmit(onRequest)}
            className="space-y-3"
          >
            <FormField
              control={requestForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={requestForm.formState.isSubmitting}
            >
              {requestForm.formState.isSubmitting && (
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}
              {requestForm.formState.isSubmitting
                ? "Sending..."
                : "Send reset link"}
            </Button>
          </form>
        </Form>
      </div>
    );
  }

  return (
    <div className="max-w-sm space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Set new password</h3>
        <p className="text-muted-foreground mt-1 mb-4 text-sm">
          Enter your new password below.
        </p>
      </div>
      <Form {...confirmForm}>
        <form
          onSubmit={confirmForm.handleSubmit(onConfirm)}
          className="space-y-3"
        >
          <FormField
            control={confirmForm.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input type="password" showPasswordToggle {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={confirmForm.control}
            name="confirmNew"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" showPasswordToggle {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={confirmForm.formState.isSubmitting}
          >
            {confirmForm.formState.isSubmitting && (
              <Loader2 className="mr-2 size-4 animate-spin" />
            )}
            {confirmForm.formState.isSubmitting
              ? "Updating..."
              : "Update password"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

// ── OTP Verification ──────────────────────────────────────────────────────────
function OtpForm() {
  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

  function startResendTimer() {
    setResendTimer(30);
    const interval = setInterval(() => {
      setResendTimer((t) => {
        if (t <= 1) {
          clearInterval(interval);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  function onComplete(value: string) {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      if (value === "000000") {
        setError(true);
        setSuccess(false);
      } else {
        setSuccess(true);
        setError(false);
      }
    }, 1000);
  }

  return (
    <div className="max-w-sm space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Verify your email</h3>
        <p className="text-muted-foreground mt-1 text-sm">
          Enter the 6-digit code sent to you@example.com
        </p>
      </div>

      <div className="flex justify-center">
        <PinInput
          value={otp}
          onChange={setOtp}
          maxLength={6}
          status={error ? "error" : success ? "success" : "default"}
          onComplete={onComplete}
        >
          <PinInputGroup>
            {Array.from({ length: 6 }, (_, i) => (
              <PinInputSlot key={i} index={i} />
            ))}
          </PinInputGroup>
        </PinInput>
      </div>

      {error && (
        <p className="text-destructive text-sm">Invalid code. Try again.</p>
      )}
      {success && (
        <p className="text-sm text-emerald-600">Verified successfully!</p>
      )}

      <div className="text-center">
        <button
          type="button"
          className="text-primary disabled:text-muted-foreground text-sm hover:underline disabled:no-underline"
          disabled={resendTimer > 0}
          onClick={startResendTimer}
        >
          {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend code"}
        </button>
      </div>
      {submitting && (
        <p className="text-muted-foreground text-center text-xs">Verifying…</p>
      )}
    </div>
  );
}

// ── Login — 2 Column ──────────────────────────────────────────────────────────
function Login2Form() {
  const form = useForm<{ email: string; password: string }>({
    defaultValues: { email: "", password: "" },
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => {})} className="max-w-xl">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    showPasswordToggle
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="mt-4 flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox /> Remember me
          </label>
          <Button type="submit" size="sm">
            Sign in
          </Button>
        </div>
      </form>
    </Form>
  );
}

// ── Sign Up — 3 Column ────────────────────────────────────────────────────────
function Signup3Form() {
  const form = useForm<{
    fn: string;
    ln: string;
    role: string;
    email: string;
    phone: string;
    dept: string;
  }>({
    defaultValues: { fn: "", ln: "", role: "", email: "", phone: "", dept: "" },
  });
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() => {})}
        className="max-w-3xl space-y-4"
      >
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="fn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First</FormLabel>
                <FormControl>
                  <Input placeholder="Jane" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ln"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dev">Developer</SelectItem>
                      <SelectItem value="design">Designer</SelectItem>
                      <SelectItem value="pm">Product Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input type="tel" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dept"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="eng">Engineering</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit">Create account</Button>
        </div>
      </form>
    </Form>
  );
}

// ── MFA Setup ─────────────────────────────────────────────────────────────────
function MfaForm() {
  const [method, setMethod] = useState<"app" | "sms" | "email">("app");
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  function onSubmit() {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
    }, 1200);
  }

  return (
    <div className="max-w-sm space-y-4">
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={method === "app" ? "default" : "outline"}
          onClick={() => {
            setMethod("app");
            setSuccess(false);
          }}
        >
          <KeyRound className="mr-1 size-3.5" /> Authenticator
        </Button>
        <Button
          size="sm"
          variant={method === "sms" ? "default" : "outline"}
          onClick={() => {
            setMethod("sms");
            setSuccess(false);
          }}
        >
          <Smartphone className="mr-1 size-3.5" /> SMS
        </Button>
        <Button
          size="sm"
          variant={method === "email" ? "default" : "outline"}
          onClick={() => {
            setMethod("email");
            setSuccess(false);
          }}
        >
          <Mail className="mr-1 size-3.5" /> Email
        </Button>
      </div>

      <p className="text-muted-foreground text-sm">
        {method === "app"
          ? "Scan the QR code with your authenticator app and enter the code below."
          : method === "sms"
            ? "A code has been sent to +1 (555) 000-0000."
            : "A code has been sent to you@example.com."}
      </p>

      {!success ? (
        <div className="flex items-center gap-3">
          <PinInput
            value={code}
            onChange={setCode}
            maxLength={6}
            onComplete={onSubmit}
          >
            <PinInputGroup>
              {Array.from({ length: 6 }, (_, i) => (
                <PinInputSlot key={i} index={i} />
              ))}
            </PinInputGroup>
          </PinInput>
          <Button
            size="sm"
            disabled={submitting || code.length < 6}
            onClick={onSubmit}
          >
            {submitting && <Loader2 className="mr-1 size-3.5 animate-spin" />}
            Verify
          </Button>
        </div>
      ) : (
        <p className="text-sm text-emerald-600">MFA enabled successfully</p>
      )}
    </div>
  );
}

// ── Profile Edit — 2 Column ───────────────────────────────────────────────────
function Profile2Form() {
  const form = useForm<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    jobTitle: string;
    dept: string;
    bio: string;
  }>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      jobTitle: "",
      dept: "",
      bio: "",
    },
  });
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() => {})}
        className="max-w-2xl space-y-4"
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input type="tel" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="jobTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dept"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="eng">Engineering</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="product">Product</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea rows={3} {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit">Save changes</Button>
        </div>
      </form>
    </Form>
  );
}

// ── Profile Edit — 3 Column ───────────────────────────────────────────────────
function Profile3Form() {
  const form = useForm<{
    fn: string;
    ln: string;
    username: string;
    email: string;
    phone: string;
    website: string;
    city: string;
    country: string;
    zip: string;
  }>({
    defaultValues: {
      fn: "",
      ln: "",
      username: "",
      email: "",
      phone: "",
      website: "",
      city: "",
      country: "",
      zip: "",
    },
  });
  const text = (
    name: keyof ReturnType<typeof form.getValues> & string,
    label: string,
    type = "text",
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type={type} {...field} />
          </FormControl>
        </FormItem>
      )}
    />
  );
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() => {})}
        className="max-w-3xl space-y-4"
      >
        <div className="grid grid-cols-3 gap-4">
          {text("fn", "First")}
          {text("ln", "Last")}
          {text("username", "Username")}
          {text("email", "Email", "email")}
          {text("phone", "Phone", "tel")}
          {text("website", "Website", "url")}
          {text("city", "City")}
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">US</SelectItem>
                      <SelectItem value="ca">CA</SelectItem>
                      <SelectItem value="uk">UK</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
          {text("zip", "Zip")}
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit">Save changes</Button>
        </div>
      </form>
    </Form>
  );
}

function FormHelpersDemo() {
  const [validationStatus, setValidationStatus] = useState<
    "error" | "warning" | "success" | undefined
  >();
  const [validationMessage, setValidationMessage] = useState("");
  const [, setValidationLoading] = useState(false);
  const form = useForm<{ helperEmail: string; helperUsername: string }>({
    defaultValues: { helperEmail: "", helperUsername: "" },
  });

  function setValidationDemo(status: "error" | "warning" | "success") {
    setValidationStatus(status);
    setValidationLoading(true);
    const messages = {
      error: "Username is already taken",
      warning: "Username is available but similar to an existing user",
      success: "Username is available",
    };
    setValidationMessage(messages[status]);
    setTimeout(() => setValidationLoading(false), 800);
  }

  return (
    <Form {...form}>
      <form className="max-w-lg space-y-6">
        <FormSection
          title="Account Details"
          description="Enter your account information below."
          divider
        >
          <FormField
            control={form.control}
            name="helperEmail"
            render={({ field }) => (
              <FormItem
                label="Email"
                required
                description="We'll never share your email with anyone."
              >
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="helperUsername"
            render={({ field }) => (
              <FormItem
                label="Username"
                required
                status={validationStatus}
                help={validationMessage}
              >
                <FormControl>
                  <Input placeholder="johndoe" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setValidationDemo("error")}
            >
              <AlertCircle className="mr-1 size-3.5" /> Error
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setValidationDemo("warning")}
            >
              <AlertCircle className="mr-1 size-3.5 text-amber-500" /> Warning
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setValidationDemo("success")}
            >
              <CheckCircle2 className="mr-1 size-3.5 text-emerald-500" />{" "}
              Success
            </Button>
          </div>
        </FormSection>

        <FormStatus
          status="error"
          message="Please fix the errors above before submitting."
        />
        <FormStatus
          status="warning"
          message="Your password is weak. Consider using a stronger one."
        />
        <FormStatus
          status="success"
          message="Your changes have been saved successfully."
        />

        <FormSection
          title="Button Alignment"
          description="FormActions supports left, center, and right alignment."
        >
          <div className="space-y-3">
            <FormActions align="left">
              <Button type="button" size="sm" variant="outline">
                Cancel
              </Button>
              <Button type="button" size="sm">
                Save
              </Button>
            </FormActions>
            <FormActions align="center">
              <Button type="button" size="sm" variant="outline">
                Cancel
              </Button>
              <Button type="button" size="sm">
                Save
              </Button>
            </FormActions>
            <FormActions align="right">
              <Button type="button" size="sm" variant="outline">
                Cancel
              </Button>
              <Button type="button" size="sm">
                Save
              </Button>
            </FormActions>
          </div>
        </FormSection>
      </form>
    </Form>
  );
}

function HorizontalLayoutDemo() {
  const form = useForm<{ hName: string; hEmail: string; hRole: string }>({
    defaultValues: { hName: "", hEmail: "", hRole: "" },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() => {})}
        className="max-w-lg space-y-4"
      >
        <FormField
          control={form.control}
          name="hName"
          render={({ field }) => (
            <FormItem label="Full Name" layout="horizontal" required>
              <FormControl>
                <Input placeholder="Jane Doe" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="hEmail"
          render={({ field }) => (
            <FormItem label="Email" layout="horizontal" required>
              <FormControl>
                <Input type="email" placeholder="jane@example.com" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="hRole"
          render={({ field }) => (
            <FormItem label="Role" layout="horizontal" labelWidth="180px">
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dev">Developer</SelectItem>
                    <SelectItem value="design">Designer</SelectItem>
                    <SelectItem value="pm">Product Manager</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
        <FormActions align="right">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit">Submit</Button>
        </FormActions>
      </form>
    </Form>
  );
}

export default function FormDemo() {
  return (
    <>
      <Story
        title="Form Helpers"
        description="FormSection, FormActions, FormStatus, and enhanced FormItem with label, required, description, help, and status."
      >
        <FormHelpersDemo />
      </Story>

      <Story
        title="Horizontal Layout"
        description="FormItem supports horizontal layout with configurable label width."
      >
        <HorizontalLayoutDemo />
      </Story>

      <Story
        title="Login — 1 Column"
        description="Standard email + password with remember me. Validates with Zod via react-hook-form."
      >
        <LoginForm />
      </Story>

      <Story
        title="Login — 2 Column"
        description="Compact side-by-side layout for wider containers."
      >
        <Login2Form />
      </Story>

      <Story
        title="Sign Up — 1 Column"
        description="Full registration form with validation."
      >
        <SignupForm />
      </Story>

      <Story
        title="Sign Up — 2 Column"
        description="Two-column grid for denser layouts."
      >
        <Signup2Form />
      </Story>

      <Story
        title="Sign Up — 3 Column"
        description="Three-column grid for maximum density."
      >
        <Signup3Form />
      </Story>

      <Story
        title="OTP Verification"
        description="6-digit code entry with resend and error states."
      >
        <OtpForm />
      </Story>

      <Story
        title="MFA Setup"
        description="Multi-factor authentication method selection and code entry."
      >
        <MfaForm />
      </Story>

      <Story
        title="Password Reset"
        description="Two-step flow: request link, then set new password."
      >
        <PasswordResetForm />
      </Story>

      <Story
        title="Profile Edit — 1 Column"
        description="Single-column profile form."
      >
        <ProfileForm />
      </Story>

      <Story
        title="Profile Edit — 2 Column"
        description="Two-column layout for profile forms."
      >
        <Profile2Form />
      </Story>

      <Story
        title="Profile Edit — 3 Column"
        description="Three-column dense profile layout."
      >
        <Profile3Form />
      </Story>
    </>
  );
}
