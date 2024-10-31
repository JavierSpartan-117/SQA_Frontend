import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'
import SoilMoistureCard from '../../src/components/SoilMoistureCard';

describe('SoilMoistureCard', () => {
    it('debe mostrar el valor de humedad y estado de conexión', () => {
        render(<SoilMoistureCard soilMoisture={300} />);
        const soilMoistureValue = screen.getByText(/300/i);
        expect(soilMoistureValue).toBeInTheDocument();

        const humidityPercentage = screen.getByText(/70\.7% de humedad/i);
        expect(humidityPercentage).toBeInTheDocument();
    });

    it('debe mostrar "Sensor no disponible" si el sensor está apagado', () => {
        render(<SoilMoistureCard soilMoisture="apagado" />);
        const unavailableText = screen.getByText(/Sensor no disponible/i);
        expect(unavailableText).toBeInTheDocument();
    });

    it('debe activar el sensor cuando se presiona el botón de encender', () => {
        render(<SoilMoistureCard soilMoisture="apagado" />);
        const powerOnButton = screen.getByRole('button', { name: /Encender/i });
        fireEvent.click(powerOnButton);
    });
});