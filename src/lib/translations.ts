const categoryTranslations: Record<string, string> = {
  Zorg: 'Health',
  Voedsel: 'Food',
  Water: 'Water',
  Stroom: 'Power',
  Informatie: 'Information',
  Opvang: 'Shelter',
  Veiligheid: 'Safety',
  Vervoer: 'Transport',
  Sport: 'Sports',
  Religie: 'Religion',
}

const locationTypeTranslations: Record<string, string> = {
  Apotheek: 'Pharmacy',
  Bibliotheek: 'Library',
  Brandweer: 'Fire station',
  Buurthuis: 'Community center',
  Drinkwaterpunt: 'Drinking water point',
  Energievoorziening: 'Power facility',
  Gemeentehuis: 'City hall',
  Huisarts: 'General practitioner',
  Kliniek: 'Clinic',
  Laadpunt: 'EV charging point',
  Opvangkandidaat: 'Potential shelter',
  Overheidskantoor: 'Government office',
  Politie: 'Police station',
  Supermarkt: 'Supermarket',
}

const locationNameTranslations: Record<string, string> = {
  'Drinkwaterpunt 1': 'Drinking Water Point 1',
  'Drinkwaterpunt 2': 'Drinking Water Point 2',
  'Drinkwaterpunt 3': 'Drinking Water Point 3',
  'Drinkwaterpunt 4': 'Drinking Water Point 4',
  'Drinkwaterpunt 5': 'Drinking Water Point 5',
  'Drinkwaterpunt 6': 'Drinking Water Point 6',
  'Drinkwaterpunt 7': 'Drinking Water Point 7',
  'Drinkwaterpunt 8': 'Drinking Water Point 8',
  'Drinkwaterpunt 9': 'Drinking Water Point 9',
  'Apotheek Keijzer': 'Keijzer Pharmacy',
  'Stratumse Service Apotheek': 'Stratum Service Pharmacy',
  'Service Apotheek Haagdijk': 'Haagdijk Service Pharmacy',
  'Medisch Centrum Hoog Bergen': 'Hoog Bergen Medical Center',
  'Gezondheidscentrum Plus': 'Plus Health Center',
  'Huisartsencentrum Parklaan': 'Parklaan General Practice Center',
  'Huisartsenpraktijk Averroes Haagdijk':
    'Averroes Haagdijk General Practice',
  'Huisartspraktijk Lichtstad': 'Lichtstad General Practice',
  'Huisartspraktijk van Eerdenbrugh': 'van Eerdenbrugh General Practice',
  'Huisartspraktijk Volckaerts': 'Volckaerts General Practice',
  'Medisch Kwartier Eindhoven': 'Eindhoven Medical Quarter',
  'Diar Supermarkt': 'Diar Supermarket',
  'Zapolski Supermarkt': 'Zapolski Supermarket',
  'Hizmet Supermarkt': 'Hizmet Supermarket',
  'Oost-West': 'East-West',
  'Politiebureau Begijnenhof': 'Begijnenhof Police Station',
  'Politiebureau Eindhoven Mathildelaan':
    'Eindhoven Mathildelaan Police Station',
  'Brandweerpost Eindhoven-Centrum': 'Eindhoven-Centre Fire Station',
  'Bedrijfsbrandweer TU Eindhoven': 'TU Eindhoven Industrial Fire Brigade',
  'Stadhuis Eindhoven': 'Eindhoven City Hall',
  'Stadskantoor Eindhoven': 'Eindhoven Municipal Office',
  'Eindhoven City Hall (Stadhuis)': 'Eindhoven City Hall',
  'de Bibliotheek Eindhoven': 'Eindhoven Library',
  'de Bibliotheek Eindhoven - tweede node':
    'Eindhoven Library - second node',
  'Bibliotheek TU/e': 'TU/e Library',
  'Bewonersbibliotheek Wilgenhof': "Wilgenhof Residents' Library",
  'Kamer van Koophandel': 'Chamber of Commerce',
  Kadaster: 'Land Registry',
  'UWV werkplein': 'UWV Employment Office',
  'Omgevingsdienst Zuidoost-Brabant':
    'Southeast Brabant Environmental Service',
  'Metropoolregio Eindhoven': 'Eindhoven Metropolitan Region',
  'Regionaal Historisch Centrum Eindhoven':
    'Eindhoven Regional Historical Center',
  'Gemeentelijk Depot Eindhoven': 'Eindhoven Municipal Depot',
  'Stichting de Kunsterij': 'de Kunsterij Foundation',
  'De Blokhut': 'The Log Cabin',
  'Spoorweg OntspanningsVereniging Voorwaarts Eindhoven':
    'Voorwaarts Eindhoven Railway Recreation Association',
  'Sociëteit Amnis': 'Amnis Society',
  'Eindhovens Studenten Corps': 'Eindhoven Student Corps',
  'Parking Garage Om de Hoek': 'Around the Corner Parking Garage',
}

function translateCategoryName(name: string) {
  return categoryTranslations[name] ?? name
}

function translateLocationName(name: string) {
  return locationNameTranslations[name] ?? name
}

function translateLocationType(type: string) {
  return locationTypeTranslations[type] ?? type
}

export {
  translateCategoryName,
  translateLocationName,
  translateLocationType,
}
