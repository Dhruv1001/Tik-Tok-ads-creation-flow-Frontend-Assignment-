export function validateAdForm(form) {
  const errors = {};

  if (!form.campaignName || form.campaignName.trim().length === 0) {
    errors.campaignName = "Campaign name is required.";
  } else if (form.campaignName.trim().length < 3) {
    errors.campaignName = "Campaign name must be at least 3 characters.";
  }

  if (!form.objective) {
    errors.objective = "Objective is required.";
  }

  if (!form.adText || form.adText.trim().length === 0) {
    errors.adText = "Ad Text is required.";
  } else if (form.adText.length > 100) {
    errors.adText = "Ad Text must be <= 100 characters.";
  }

  if (!form.cta) {
    errors.cta = "CTA is required.";
  }

  if (!form.musicOption) {
    errors.musicOption = "Please choose a music option.";
  } else {
    if (form.musicOption === "none" && form.objective === "Conversions") {
      errors.musicOption = "No Music is not allowed for Conversions objective.";
    }

    if (form.musicOption === "existing") {
      if (!form.musicId || form.musicId.trim().length === 0) {
        errors.musicId = "Music ID is required.";
      }
    }

    if (form.musicOption === "upload") {
      if (!form.musicId) {
        errors.musicId = "Please upload/generate a music ID.";
      }
    }
  }

  return errors;
}
