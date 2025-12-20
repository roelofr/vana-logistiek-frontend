let vendorId = 1
const vendorById = new Map<number, Vendor>()

const createVendor = (name: string, number: string): Vendor => {
  const vendor: Vendor = {
    id: vendorId++,
    name,
    number
  }

  vendorById.set(vendor.id, vendor)

  return vendor
}

export const vendors = [
  createVendor('Stevie Wondershop', '100'),
  createVendor('Mooie Mannen', '102'),
  createVendor('Constructieve Maliën', '103'),
  createVendor('Wicked Women', '303'),
  createVendor('Vegan Vengeance', 'C5'),
  createVendor('Magic Without', '301a'),
  createVendor('Magic World', '301b'),
  createVendor('Wings of Magic', '302a'),
  createVendor('Magic Feeling', '303a'),
  createVendor('World of Magic', '303b'),
  createVendor('Crazy Cat', '1104'),
  createVendor('Beaf Jerky', 'C21'),
  createVendor('Lana\'s Kraamemporium', 'C69')
]
