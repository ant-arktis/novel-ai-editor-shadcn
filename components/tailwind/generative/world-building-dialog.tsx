"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useState } from "react";

interface WorldBuildingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onSubmit: (details: string) => void;
}

export function WorldBuildingDialog({
  open,
  onOpenChange,
  title,
  description,
  onSubmit,
}: WorldBuildingDialogProps) {
  const [details, setDetails] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder={description}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={5}
          />
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSubmit(details);
              setDetails("");
              onOpenChange(false);
            }}
          >
            Add
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 