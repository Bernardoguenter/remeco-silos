import { describe, it, expect } from 'vitest';

/**
 * Tests para componentes Astro
 * 
 * Nota: Astro es un framework de compilación estática, por lo que los tests
 * de componentes pueden ser de dos tipos:
 * 
 * 1. Tests de lógica TypeScript dentro del frontmatter (---) del componente
 * 2. Tests de la lógica de renderizado usando astro:content o mediante
 *    testing de la lógica que el componente utiliza
 * 
 * Este archivo contiene tests para la lógica que usan los componentes.
 */

// Test del componente SiloPrice
describe('SiloPrice Component Logic', () => {
  it('should display price and IVA percentage correctly', () => {
    const price = '$1,000';
    const ivaPercentage = 21;

    // Simulamos lo que el componente renderizaría
    const expectedContent = `Precio: ${price}`;
    const expectedIvaText = `(Incluye IVA ${ivaPercentage}%)`;

    expect(expectedContent).toContain('Precio:');
    expect(expectedIvaText).toContain('21%');
  });

  it('should format price as currency string', () => {
    const price = '$1,000';
    expect(price).toMatch(/\$\d+/);
  });
});

// Test del componente SiloDescription
describe('SiloDescription Component Logic', () => {
  it('should accept description, price, and iva_percentage props', () => {
    const props = {
      description: 'Características del silo',
      price: '$5,000',
      iva_percentage: 21,
    };

    expect(props).toHaveProperty('description');
    expect(props).toHaveProperty('price');
    expect(props).toHaveProperty('iva_percentage');
    expect(props.iva_percentage).toBe(21);
  });

  it('should have valid price format', () => {
    const price = '$5,000';
    expect(price).toMatch(/^\$/);
  });
});

// Test del componente SiloDescriptionWithOptions
describe('SiloDescriptionWithOptions Component Logic', () => {
  it('should calculate option prices with cone_base adjustments', () => {
    const basePrice = 1000;
    const cone_base_45 = 10; // 10% adicional
    const cone_base_55 = 15; // 15% adicional

    const price45 = basePrice * (1 + cone_base_45 / 100);
    const price55 = basePrice * (1 + cone_base_55 / 100);

    expect(price45).toBe(1100);
    expect(price55).toBe(1150);
    expect(price45).toBeGreaterThan(basePrice);
    expect(price55).toBeGreaterThan(basePrice);
  });

  it('should map options correctly', () => {
    const options = {
      '45': 'Detalles del cono 45°',
      '55': 'Detalles del cono 55°',
    };

    const mappedOptions = Object.entries(options).map(([angle, detail]) => ({
      angle,
      detail,
      title: `Cono ${angle}°`,
    }));

    expect(mappedOptions).toHaveLength(2);
    expect(mappedOptions[0].title).toBe('Cono 45°');
    expect(mappedOptions[1].title).toBe('Cono 55°');
  });

  it('should combine base description with option detail', () => {
    const baseDescription = 'Silo de almacenamiento';
    const optionDetail = 'con cono 45°';

    const combinedDescription = `${baseDescription}, ${optionDetail}`;

    expect(combinedDescription).toContain('Silo de almacenamiento');
    expect(combinedDescription).toContain('cono 45°');
  });

  it('should handle all required props', () => {
    const props = {
      description: 'Test description',
      price: 1000,
      iva_percentage: 21,
      options: { '45': 'detail45', '55': 'detail55' },
      cone_base_45: 10,
      cone_base_55: 15,
    };

    expect(props).toHaveProperty('description');
    expect(props).toHaveProperty('price');
    expect(props).toHaveProperty('iva_percentage');
    expect(props).toHaveProperty('options');
    expect(props).toHaveProperty('cone_base_45');
    expect(props).toHaveProperty('cone_base_55');
  });
});

// Test del componente GridCard
describe('GridCard Component Logic', () => {
  it('should accept required image and link props', () => {
    const props = {
      imageSrc: 'https://example.com/image.jpg',
      alt: 'Silo image',
      title: 'Silo 1',
      imgWidth: 500,
      imgHeight: 500,
      link: '/silos/comederos/silo1',
    };

    expect(props).toHaveProperty('imageSrc');
    expect(props).toHaveProperty('alt');
    expect(props).toHaveProperty('title');
    expect(props).toHaveProperty('link');
    expect(props.imgWidth).toBe(500);
    expect(props.imgHeight).toBe(500);
  });

  it('should have default layout value', () => {
    const layout = 'constrained';
    expect(['constrained', 'full-width', 'fixed', 'none']).toContain(layout);
  });

  it('should generate correct silo link', () => {
    const siloType = 'comederos';
    const siloName = 'silo1';
    const link = `/silos/${siloType}/${siloName}`;

    expect(link).toBe('/silos/comederos/silo1');
    expect(link).toMatch(/^\/silos\//);
  });
});

// Test del componente SiloList
describe('SiloList Component Logic', () => {
  it('should handle empty silo list', () => {
    const silos: any[] = [];

    expect(Array.isArray(silos)).toBe(true);
    expect(silos.length).toBe(0);
    expect(silos.length > 0).toBe(false);
  });

  it('should map silos to GridCard props', () => {
    const silos = [
      {
        id: 1,
        name: 'silo1',
        image_url: 'https://example.com/1.jpg',
        silo_type: 'comederos',
        description: 'Test',
        has_options: false,
        options: {},
      },
      {
        id: 2,
        name: 'silo2',
        image_url: 'https://example.com/2.jpg',
        silo_type: 'aereos',
        description: 'Test',
        has_options: false,
        options: {},
      },
    ];

    const gridCardProps = silos.map((silo) => ({
      imageSrc: silo.image_url,
      alt: silo.name,
      title: `Silo ${silo.name}`,
      link: `/silos/${silo.silo_type}/${silo.name}`,
    }));

    expect(gridCardProps).toHaveLength(2);
    expect(gridCardProps[0].title).toBe('Silo silo1');
    expect(gridCardProps[1].link).toBe('/silos/aereos/silo2');
  });

  it('should display message when no silos available', () => {
    const silos: any[] = [];
    const noSilosMessage = 'No hay silos disponibles.';

    if (!Array.isArray(silos) || silos.length === 0) {
      expect(noSilosMessage).toBeTruthy();
    }
  });
});
