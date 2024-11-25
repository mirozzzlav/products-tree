export default {
  name: 'MC023CG-SY-FL',
  children: [
    {
      name: 'MT023CG-FRONT-SUBASSM',
      children: [
        {
          name: 'FLT-IR650-AR2X-D25',
        },
        {
          name: 'MECH-MT-MID-023',
        },
        {
          name: 'MT023CG-PR-SENSOR-PCA',
          children: [
            { name: 'C-0402-4U7-6.3V-X5R' },
            { name: 'C-0402-U10-25V-X5R' },
            { name: 'C-0402-U22-25V-X5R' },
          ],
        },
        {
          name: 'SROB-M1.6X3-SLOT-STNLS',
        },
      ],
    },
    {
      name: 'MC-REAR-FL-SUBASSM',
      children: [
        {
          name: 'MC-MAIN-FL-PCA',
        },
        {
          name: 'TP-15X15X1-TGA3500',
        },
        {
          name: 'MECH-MC-REAR-FL-LP',
        },
      ],
    },
    {
      name: 'SROB-M2X10-CUST',
    },
  ],
};
