import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import HumidityTemperatureCard from '../../src/components/HumidityTemperatureCard';
import useControlSensor from '../../src/hooks/useControlSensor';

jest.mock('../../src/hooks/useControlSensor');

describe('HumidityTemperatureCard', () => {
    const mockControlSensor = jest.fn();

    beforeEach(() => {
        (useControlSensor as jest.Mock).mockReturnValue({
            controlSensor: mockControlSensor,
            loading: false,
            error: null,
        });
        mockControlSensor.mockClear();
    });

    it('debe mostrar los valores de humedad y temperatura cuando el sensor está conectado', () => {
        render(<HumidityTemperatureCard humidity={60} temperature={25} />);

        const humidityValue = screen.getByText(/60%/i);
        expect(humidityValue).toBeInTheDocument();
        expect(screen.getByText(/Humedad relativa/i)).toBeInTheDocument();

        const temperatureValue = screen.getByText(/25°C/i);
        expect(temperatureValue).toBeInTheDocument();
        expect(screen.getByText(/Celsius/i)).toBeInTheDocument();
    });

    it('debe activar el sensor cuando se presiona el botón de encender', () => {
        render(<HumidityTemperatureCard humidity="apagado" temperature="apagado" />);

        const powerOnButton = screen.getByRole('button', { name: /Encender DHT11/i });
        fireEvent.click(powerOnButton);


        expect(mockControlSensor).toHaveBeenCalledWith('humidity-temperature', 'on');
    });

    it('debe desactivar el sensor cuando se presiona el botón de apagar', () => {
        render(<HumidityTemperatureCard humidity={60} temperature={25} />);

        const powerOffButton = screen.getByRole('button', { name: /Apagar DHT11/i });
        fireEvent.click(powerOffButton);

        expect(mockControlSensor).toHaveBeenCalledWith('humidity-temperature', 'off');
    });

    it('debe deshabilitar los botones cuando loading es true', () => {
        (useControlSensor as jest.Mock).mockReturnValue({
            controlSensor: mockControlSensor,
            loading: true,
            error: null,
        });

        render(<HumidityTemperatureCard humidity="apagado" temperature="apagado" />);

        const powerOnButton = screen.getByRole('button', { name: /Encender DHT11/i });
        const powerOffButton = screen.getByRole('button', { name: /Apagar DHT11/i });

        expect(powerOnButton).toBeDisabled();
        expect(powerOffButton).toBeDisabled();
    });

    it('debe mostrar un mensaje de error si ocurre un error', () => {
        (useControlSensor as jest.Mock).mockReturnValue({
            controlSensor: mockControlSensor,
            loading: false,
            error: { message: 'Error al cambiar el estado del sensor' },
        });

        render(<HumidityTemperatureCard humidity="apagado" temperature="apagado" />);

        const errorMessage = screen.getByText(/Error: Error al cambiar el estado del sensor/i);
        expect(errorMessage).toBeInTheDocument();
    });
});
