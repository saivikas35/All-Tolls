export const templateVariants = [
  {
    id: "ats_clean",
    layout: {
      page: "max-w-[800px] mx-auto bg-white p-10"
    },
    variants: {
      header: "text-left border-b pb-3",
      section: "mt-6",
      item: "mt-2 text-sm"
    }
  },

  {
    id: "modern_bold",
    layout: {
      page: "max-w-[900px] mx-auto bg-white p-12"
    },
    variants: {
      header: "text-center bg-gray-100 p-6 rounded-lg",
      section: "mt-8",
      item: "mt-4 text-sm"
    }
  },

  {
    id: "two_column",
    layout: {
      page: "grid grid-cols-[2fr_1fr] gap-6 p-10"
    },
    variants: {
      header: "col-span-2 text-left border-b pb-2",
      section: "mt-4",
      item: "text-xs"
    }
  }
];
