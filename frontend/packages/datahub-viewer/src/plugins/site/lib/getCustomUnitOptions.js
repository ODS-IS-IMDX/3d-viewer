// Copyright (c) 2025 NTT InfraNet
const getCustomUnitOptions = (t: string => string) => [
  { label: t('site:modals.siteSettings.custom.units.mm'), value: 'mm' },
  { label: t('site:modals.siteSettings.custom.units.cm'), value: 'cm' },
  { label: t('site:modals.siteSettings.custom.units.m'), value: 'm' },
  { label: t('site:modals.siteSettings.custom.units.km'), value: 'km' },
  { label: t('site:modals.siteSettings.custom.units.in'), value: 'in' },
  { label: t('site:modals.siteSettings.custom.units.yd'), value: 'yd' },
  { label: t('site:modals.siteSettings.custom.units.us-ft'), value: 'us-ft' },
  { label: t('site:modals.siteSettings.custom.units.ft'), value: 'ft' },
  { label: t('site:modals.siteSettings.custom.units.fathom'), value: 'fathom' },
  { label: t('site:modals.siteSettings.custom.units.mi'), value: 'mi' },
  { label: t('site:modals.siteSettings.custom.units.nMi'), value: 'nMi' }
]

export default getCustomUnitOptions
