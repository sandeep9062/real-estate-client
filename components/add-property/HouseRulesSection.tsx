"use client";

import React from "react";
import { Box, Divider, Select, Switch, Text, TextInput } from "@mantine/core";

const GUESTS_OPTS = [
  { value: "allowed", label: "Allowed" },
  { value: "allowed_with_notice", label: "Allowed with prior notice" },
  { value: "not_allowed", label: "Not allowed" },
];

interface HouseRulesSectionProps {
  // Mantine form instance from PropertyDetailsStep — lets this section read
  // and write the nested `houseRules.*` paths directly.
  form: any;
}

/**
 * House rules for shared / subletted rentals. Rendered by
 * PropertyDetailsStep only when deal === "Rent" && allowsSubletting.
 */
const HouseRulesSection: React.FC<HouseRulesSectionProps> = ({ form }) => {
  const hasCurfew = form.values.houseRules?.curfew?.hasCurfew;

  return (
    <Box>
      <Divider />
      <Text fw={700} size="lg" mt="md">
        House rules
      </Text>
      <Text size="sm" c="dimmed" mb="sm">
        Shown to tenants looking to sublet or room-share in this property.
      </Text>

      <div className="flex flex-col gap-4">
        <Switch
          label="Owner / landlord lives on the premises"
          {...form.getInputProps("houseRules.ownerLivesOnPremises", {
            type: "checkbox",
          })}
        />

        <Switch
          label="Curfew applies"
          description="Some PGs and shared stays have an entry cut-off time."
          {...form.getInputProps("houseRules.curfew.hasCurfew", {
            type: "checkbox",
          })}
        />
        {hasCurfew && (
          <TextInput
            label="Curfew time"
            description="Entry cut-off time for tenants."
            placeholder="e.g. 22:00"
            type="time"
            {...form.getInputProps("houseRules.curfew.time")}
            classNames={{ input: "border-gray-300" }}
          />
        )}

        <Select
          label="Opposite-gender guests"
          description="Visitors of a different gender than the tenant."
          data={GUESTS_OPTS}
          placeholder="Select"
          clearable
          {...form.getInputProps("houseRules.oppositeGenderGuestsAllowed")}
          classNames={{ input: "border-gray-300" }}
          styles={{ dropdown: { zIndex: 1300 } }}
        />

        <Select
          label="Overnight guests"
          description="Whether guests can stay overnight."
          data={GUESTS_OPTS}
          placeholder="Select"
          clearable
          {...form.getInputProps("houseRules.overnightGuestsAllowed")}
          classNames={{ input: "border-gray-300" }}
          styles={{ dropdown: { zIndex: 1300 } }}
        />

        <Switch
          label="Smoking allowed on premises"
          {...form.getInputProps("houseRules.smokingAllowedOnPremises", {
            type: "checkbox",
          })}
        />

        <Switch
          label="Drinking allowed on premises"
          {...form.getInputProps("houseRules.drinkingAllowedOnPremises", {
            type: "checkbox",
          })}
        />
      </div>
    </Box>
  );
};

export default HouseRulesSection;
