import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { WizardFormData } from "@/types/brite";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const schema = z.object({
  companyName: z.string().min(2, "Enter company name"),
  industry: z.string().min(2, "Enter your industry"),
  businessModel: z.enum(["B2C", "B2B", "Hybrid"]),
  companySize: z.enum(["Startup", "SME", "Enterprise"]),
});

type FormValues = Pick<WizardFormData, "companyName" | "industry" | "businessModel" | "companySize">;

interface Props {
  defaultValues: Partial<WizardFormData>;
  onNext: (data: Partial<WizardFormData>) => void;
}

export function Step1Industry({ defaultValues, onNext }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      companyName: defaultValues.companyName ?? "",
      industry: defaultValues.industry ?? "",
      businessModel: defaultValues.businessModel ?? "B2B",
      companySize: defaultValues.companySize ?? "SME",
    },
  });

  const businessModel = watch("businessModel");
  const companySize = watch("companySize");

  return (
    <form onSubmit={handleSubmit(onNext)}>
      <Card>
        <CardHeader>
          <CardTitle>Company Profile</CardTitle>
          <CardDescription>Tell us about your business context.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              placeholder="e.g. Acme Corp"
              {...register("companyName")}
            />
            {errors.companyName && (
              <p className="text-sm text-destructive">{errors.companyName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Input
              id="industry"
              placeholder="e.g. Retail, Healthcare, Finance"
              {...register("industry")}
            />
            {errors.industry && (
              <p className="text-sm text-destructive">{errors.industry.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Business Model</Label>
            <RadioGroup
              value={businessModel}
              onValueChange={(v) => setValue("businessModel", v as FormValues["businessModel"])}
              className="flex gap-4"
            >
              {(["B2C", "B2B", "Hybrid"] as const).map((v) => (
                <div key={v} className="flex items-center space-x-2">
                  <RadioGroupItem value={v} id={`bm-${v}`} />
                  <Label htmlFor={`bm-${v}`}>{v}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Company Size</Label>
            <RadioGroup
              value={companySize}
              onValueChange={(v) => setValue("companySize", v as FormValues["companySize"])}
              className="flex gap-4"
            >
              {(["Startup", "SME", "Enterprise"] as const).map((v) => (
                <div key={v} className="flex items-center space-x-2">
                  <RadioGroupItem value={v} id={`cs-${v}`} />
                  <Label htmlFor={`cs-${v}`}>{v}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <Button type="submit" className="w-full">
            Next →
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
