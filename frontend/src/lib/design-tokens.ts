export const designTokens = {

    layouts: {
        // Koristiti za glavne stranice
        mainPage: "min-h-screen bg-gray-50",
        // Koristiti za auth stranice
        authPage: "min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50",
        // Container za sadržaj stranica
        pageContainer: "max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8",
    },

    // Typography hierarchy
    typography: {
        // h1
        pageTitle: "text-2xl font-bold text-gray-900",
        // h2
        sectionTitle: "text-xl font-semibold text-gray-900",
        // h3 - naslov podsekcije
        subsectionTitle: "text-lg font-medium text-gray-900",
        // h4 - mali naslov
        cardTitle: "text-base font-semibold text-gray-900",
        // Obični tekst
        body: "text-sm text-gray-700",
        // Smanjen/muted tekst
        muted: "text-sm text-gray-500",
        // Extra mali tekst
        small: "text-xs text-gray-400",
        // Description tekst ispod naslova
        pageDescription: "text-base text-gray-600", // DODANO
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

        componentSpacing: "space-y-3",
        // Grid gap za layout
        gridGap: "gap-6",
    },

    colors: {
        // Primary colors
        primary: "orange-600",
        primaryHover: "orange-700",
        primaryLight: "orange-100",
        primaryDark: "orange-800",
        secondary: "red-600",
        secondaryHover: "red-700",
        // Accent colors
        accent: "amber-500",
        success: "green-500",
        successLight: "green-100",
        warning: "yellow-500",
        warningLight: "yellow-100",
        danger: "red-500",
        dangerLight: "red-100",
        // Status colors za order states
        ordered: "blue-500",
        preparing: "yellow-500",
        delivery: "purple-500",
        delivered: "green-500",
        canceled: "red-500",
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
        // Warning kartica
        warning: "bg-yellow-50 border-yellow-200 rounded-lg",
        // Interactive kartica sa hover
        interactive: "bg-white shadow rounded-lg border hover:shadow-md transition-shadow",
        // Selected kartica
        selected: "bg-orange-50 border-orange-300 rounded-lg shadow-sm",
    },

    buttons: {
        primary: "bg-orange-600 hover:bg-orange-700",
        secondary: "bg-red-600 hover:bg-red-700",
        destructive: "bg-red-600 hover:bg-red-700",
        success: "bg-green-600 hover:bg-green-700",
        outline: "border border-gray-300 hover:bg-gray-50",
        ghost: "hover:bg-gray-100",
        loading: "opacity-50 cursor-not-allowed",
    },

    // Status badges za orders
    badges: {
        ordered: "bg-blue-100 text-blue-800 border-blue-200",
        preparing: "bg-yellow-100 text-yellow-800 border-yellow-200",
        delivery: "bg-purple-100 text-purple-800 border-purple-200",
        delivered: "bg-green-100 text-green-800 border-green-200",
        canceled: "bg-red-100 text-red-800 border-red-200",
        default: "bg-gray-100 text-gray-800 border-gray-200",
    },

    // Form styling
    forms: {
        input: "border-gray-300 focus:border-orange-500 focus:ring-orange-500",
        inputError: "border-red-300 focus:border-red-500 focus:ring-red-500",
        label: "text-sm font-medium text-gray-700",
        labelRequired: "text-sm font-medium text-gray-700 after:content-['*'] after:text-red-500 after:ml-1",
        helpText: "text-xs text-gray-500",
        errorText: "text-xs text-red-600",
    },

    // Loading states
    loading: {
        spinner: "animate-spin",
        skeleton: "animate-pulse bg-gray-200 rounded",
        fade: "opacity-50",
        pulse: "animate-pulse",
    },

    // Tables
    tables: {
        container: "overflow-x-auto",
        table: "min-w-full divide-y divide-gray-200",
        header: "bg-gray-50",
        headerCell: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
        row: "hover:bg-gray-50 transition-colors",
        rowSelected: "bg-orange-50",
        cell: "px-6 py-4 whitespace-nowrap text-sm",
    }

} as const;

export const dt = designTokens;