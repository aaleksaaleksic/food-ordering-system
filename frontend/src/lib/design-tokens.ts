
export const designTokens = {

    layouts: {
        // Koristiti za glavne stranice
        mainPage: "min-h-screen bg-gray-50",
        // Koristiti za auth stranice
        authPage: "min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50",
        // Container za sadržaj stranica
        pageContainer: "max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8",
    },

    // Typography hierarchy - standardizovano
    typography: {
        // h1
        pageTitle: "text-2xl font-bold text-gray-900",
        // h2
        sectionTitle: "text-xl font-semibold text-gray-900",
        // h3
        subsectionTitle: "text-lg font-medium text-gray-900",
        // Obični tekst
        body: "text-sm text-gray-700",
        // Smanjen/muted tekst
        muted: "text-sm text-gray-500",
        // Extra mali tekst
        small: "text-xs text-gray-400",
    },

    spacing: {
        // Razmak između glavnih sekcija na stranici
        pageSections: "space-y-8",
        // Razmak u kartici između elemenata
        cardContent: "space-y-4",
        // Razmak u formi između polja
        formFields: "space-y-4",
        // Padding u karticama
        cardPadding: "p-6",
    },

    colors: {
        // Primary colors
        primary: "orange-600",
        primaryHover: "orange-700",
        secondary: "red-600",
        secondaryHover: "red-700",
        // Accent colors
        accent: "amber-500",
        success: "green-500",
        warning: "yellow-500",
        danger: "red-500",
    },

    cards: {
        // Standardna kartica
        default: "bg-white shadow rounded-lg border",
        // Kartica s više shadow-a
        elevated: "bg-white shadow-lg rounded-lg border",
        // Info kartica
        info: "bg-orange-50 border-orange-200 rounded-lg",
        // Error kartica
        error: "bg-red-50 border-red-200 rounded-lg",
        // Success kartica
        success: "bg-green-50 border-green-200 rounded-lg",
    },

    buttons: {
        primary: "bg-orange-600 hover:bg-orange-700",
        secondary: "bg-red-600 hover:bg-red-700",
        destructive: "bg-red-600 hover:bg-red-700",
        success: "bg-green-600 hover:bg-green-700",
    }
} as const;

export const dt = designTokens;