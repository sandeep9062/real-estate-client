import React from "react";

/** Field-visibility flags computed in BasicDetails from deal/type/category. */
export interface FieldVisibility {
  categoryOptions: string[];
  isLand: boolean;
  showCommercialExtras: boolean;
  showFurnishing: boolean;
  showFacing: boolean;
  showAmenities: boolean;
  showAgeOfProperty: boolean;
  showRentTerms: boolean;
  showSalePricePerSqft: boolean;
  showOCStatus: boolean;
}

export interface BasicDetailsSectionProps {
  /** Mantine form instance created with useForm() in BasicDetails. */
  form: any;
  visibility: FieldVisibility;
}

export interface PropertyDetailsSectionProps extends BasicDetailsSectionProps {
  propertyDetails: any;
  setPropertyDetails: React.Dispatch<React.SetStateAction<any>>;
}
