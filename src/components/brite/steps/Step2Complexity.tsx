import { useState } from "react";
import { WizardFormData } from "@/types/brite";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface Props {
  defaultValues: Partial<WizardFormData>;
  onNext: (data: Partial<WizardFormData>) => void;
  onBack: () => void;
}

export function Step2Complexity({ defaultValues, onNext, onBack }: Props) {
  const [numberOfChannels, setNumberOfChannels] = useState(defaultValues.numberOfChannels ?? 1);
  const [numberOfIntegrations, setNumberOfIntegrations] = useState(
    defaultValues.numberOfIntegrations ?? 0
  );
  const [hasOmnichannelPresence, setHasOmnichannelPresence] = useState(
    defaultValues.hasOmnichannelPresence ?? false
  );
  const [hasExternalPartners, setHasExternalPartners] = useState(
    defaultValues.hasExternalPartners ?? false
  );

  const handleNext = () => {
    onNext({ numberOfChannels, numberOfIntegrations, hasOmnichannelPresence, hasExternalPartners });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ecosystem Complexity</CardTitle>
        <CardDescription>Eixo X — How distributed is your digital ecosystem?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label>Sales/Service Channels</Label>
            <span className="text-lg font-bold text-primary">{numberOfChannels}</span>
          </div>
          <Slider
            min={1}
            max={10}
            step={1}
            value={[numberOfChannels]}
            onValueChange={(v) => { const arr = Array.isArray(v) ? v : [v]; setNumberOfChannels(arr[0] as number); }}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1 channel</span>
            <span>10+ channels</span>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label>External Integrations / Partners</Label>
            <span className="text-lg font-bold text-primary">{numberOfIntegrations}</span>
          </div>
          <Slider
            min={0}
            max={20}
            step={1}
            value={[numberOfIntegrations]}
            onValueChange={(v) => { const arr = Array.isArray(v) ? v : [v]; setNumberOfIntegrations(arr[0] as number); }}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>None</span>
            <span>20+</span>
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Omnichannel Presence</Label>
            <p className="text-sm text-muted-foreground">Physical + digital simultaneously</p>
          </div>
          <Switch checked={hasOmnichannelPresence} onCheckedChange={setHasOmnichannelPresence} />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>External Partner Network</Label>
            <p className="text-sm text-muted-foreground">Suppliers, marketplaces, 3PLs</p>
          </div>
          <Switch checked={hasExternalPartners} onCheckedChange={setHasExternalPartners} />
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack} className="flex-1">
            ← Back
          </Button>
          <Button onClick={handleNext} className="flex-1">
            Next →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
