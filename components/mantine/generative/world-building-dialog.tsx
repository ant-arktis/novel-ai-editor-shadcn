"use client";

import { Modal, Button, Textarea, Group, Stack } from "@mantine/core";
import { useState } from "react";

interface WorldBuildingDialogProps {
  opened: boolean;
  onClose: () => void;
  title: string;
  description: string;
  onSubmit: (details: string) => void;
}

export function WorldBuildingDialog({
  opened,
  onClose,
  title,
  description,
  onSubmit,
}: WorldBuildingDialogProps) {
  const [details, setDetails] = useState("");

  return (
    <Modal opened={opened} onClose={onClose} title={title}>
      <Stack>
        <Textarea
          placeholder={description}
          value={details}
          onChange={(e) => setDetails(e.currentTarget.value)}
          minRows={5}
        />
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSubmit(details);
              setDetails("");
              onClose();
            }}
          >
            Add
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
} 