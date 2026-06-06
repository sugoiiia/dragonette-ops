// Approximate real-world hyperspectral reflectance signatures.
// wavelength in nm, reflectance in [0, 1].
// Key bands: 400-700 visible, 700-1300 NIR, 1300-2500 SWIR.

const wl = [
  400, 430, 460, 490, 520, 550, 580, 610, 640, 660,
  680, 700, 720, 740, 760, 800, 860, 920, 1000, 1100,
  1200, 1300, 1500, 1600, 1700, 1900, 2100, 2200, 2400, 2500,
]

const zip = (vals) => wl.map((w, i) => ({ wavelength: w, reflectance: +vals[i].toFixed(4) }))

export const spectra = {
  vegetation: {
    label: 'Vegetation',
    color: '#4ade80',
    description:
      'Healthy green vegetation. The sharp NIR jump between 700–740 nm is the red edge — chlorophyll absorbs red light strongly while the cell-wall structure back-scatters NIR. ' +
      'Water absorption creates dips near 1400 nm and 1900 nm. NDVI is derived from the ratio of this NIR plateau to the red trough at 680 nm.',
    data: zip([
      0.034, 0.038, 0.048, 0.065, 0.092, 0.130, 0.080, 0.055, 0.042, 0.038,
      0.033, 0.042, 0.205, 0.400, 0.470, 0.520, 0.530, 0.515, 0.490, 0.465,
      0.445, 0.255, 0.078, 0.350, 0.330, 0.145, 0.190, 0.195, 0.125, 0.110,
    ]),
  },

  water: {
    label: 'Water (clear)',
    color: '#38bdf8',
    description:
      'Clear, low-turbidity water. Reflectance peaks in the blue-green (~480 nm) and drops sharply past 700 nm — liquid water absorbs NIR and SWIR almost completely. ' +
      'In NIR band composites, water appears as near-black, enabling easy land/water masking. Higher sediment load shifts the peak toward green/yellow.',
    data: zip([
      0.052, 0.060, 0.062, 0.058, 0.052, 0.044, 0.032, 0.022, 0.014, 0.010,
      0.007, 0.005, 0.003, 0.002, 0.0015, 0.0008, 0.0004, 0.0002, 0.0001, 0.00006,
      0.00004, 0.00003, 0.00002, 0.00001, 0.00001, 0.000005, 0.000004, 0.000003, 0.000002, 0.000001,
    ]),
  },

  soil: {
    label: 'Bare Soil',
    color: '#d97706',
    description:
      'Dry, bare mineral soil (loam). Reflectance increases smoothly from blue to SWIR, shaped by iron oxide content (reddish soils absorb blue), moisture level, and particle size. ' +
      'The moderate dips at ~1400 nm and ~1900 nm are OH/water absorption features in clay minerals — deeper dips indicate higher clay content.',
    data: zip([
      0.072, 0.090, 0.110, 0.128, 0.144, 0.158, 0.168, 0.175, 0.182, 0.186,
      0.190, 0.196, 0.204, 0.212, 0.220, 0.235, 0.250, 0.260, 0.270, 0.278,
      0.282, 0.262, 0.098, 0.290, 0.305, 0.158, 0.285, 0.292, 0.270, 0.260,
    ]),
  },

  urban: {
    label: 'Urban / Built',
    color: '#94a3b8',
    description:
      'Mixed urban surface — concrete, asphalt, metal rooftops, and pavement. ' +
      'The broadly flat, moderate reflectance with no sharp spectral features distinguishes built surfaces from both vegetation and bare soil. ' +
      'Rooftop materials create subtle variability; impervious surfaces remain detectable even under thin cloud cover in SWIR bands.',
    data: zip([
      0.062, 0.075, 0.088, 0.100, 0.110, 0.118, 0.124, 0.130, 0.134, 0.136,
      0.138, 0.140, 0.143, 0.146, 0.150, 0.155, 0.162, 0.166, 0.170, 0.174,
      0.176, 0.164, 0.072, 0.178, 0.182, 0.128, 0.170, 0.172, 0.155, 0.148,
    ]),
  },

  snow: {
    label: 'Snow / Ice',
    color: '#cbd5e1',
    description:
      'Fresh snow or glacier ice. Near-perfect visible reflectance (>85%) makes snow the brightest natural surface on Earth in optical imagery. ' +
      'Reflectance falls sharply in NIR due to ice crystal absorption, and reaches near-zero in SWIR. ' +
      'Snow age and grain size determine the exact slope — older, coarser snow absorbs more NIR.',
    data: zip([
      0.890, 0.912, 0.918, 0.920, 0.918, 0.912, 0.904, 0.896, 0.884, 0.874,
      0.862, 0.842, 0.812, 0.775, 0.728, 0.650, 0.530, 0.400, 0.260, 0.170,
      0.110, 0.088, 0.042, 0.078, 0.065, 0.028, 0.022, 0.018, 0.010, 0.008,
    ]),
  },
}
