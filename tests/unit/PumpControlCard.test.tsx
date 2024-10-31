import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PumpControlCard from '../../src/components/PumpControlCard';
import useControlSensor from '../../src/hooks/useControlSensor';

// Mock del hook personalizado
jest.mock('../../src/hooks/useControlSensor');

describe('PumpControlCard', () => {
    const mockWaterPumpMode = jest.fn();
    const mockControlSensor = jest.fn();

    beforeEach(() => {
        // Configura el mock para cada prueba
        (useControlSensor as jest.Mock).mockReturnValue({
            waterPumpMode: mockWaterPumpMode,
            controlSensor: mockControlSensor,
            loading: false,
            error: null,
        });
        mockWaterPumpMode.mockClear();
        mockControlSensor.mockClear();
    });

    it('debe mostrar el modo de operación actual y permitir cambiar a modo automático', () => {
        render(<PumpControlCard pumpMode="manual" waterLevel="Con agua" pumpStatus="apagado" />);

        const autoButton = screen.getByRole('button', { name: /Automático/i });
        fireEvent.click(autoButton);

        // Verifica que el modo de operación cambie a automático
        expect(mockWaterPumpMode).toHaveBeenCalledWith('auto');
    });

    it('debe mostrar el modo de operación actual y permitir cambiar a modo manual', () => {
        render(<PumpControlCard pumpMode="automatico" waterLevel="Con agua" pumpStatus="apagado" />);

        const manualButton = screen.getByRole('button', { name: /Manual/i });
        fireEvent.click(manualButton);

        // Verifica que el modo de operación cambie a manual
        expect(mockWaterPumpMode).toHaveBeenCalledWith('manual');
    });

    it('debe activar la bomba cuando se hace clic en "Encender Bomba" si las condiciones son correctas', () => {
        render(<PumpControlCard pumpMode="manual" waterLevel="Con agua" pumpStatus="apagado" />);

        const turnOnButton = screen.getByRole('button', { name: /Encender Bomba/i });
        fireEvent.click(turnOnButton);

        // Verifica que controlSensor fue llamado con los argumentos correctos
        expect(mockControlSensor).toHaveBeenCalledWith('water-pump', 'on');
    });

    it('debe desactivar la bomba cuando se hace clic en "Apagar Bomba" si está encendida', () => {
        render(<PumpControlCard pumpMode="manual" waterLevel="Con agua" pumpStatus="encendido" />);

        const turnOffButton = screen.getByRole('button', { name: /Apagar Bomba/i });
        fireEvent.click(turnOffButton);

        // Verifica que controlSensor fue llamado con los argumentos correctos
        expect(mockControlSensor).toHaveBeenCalledWith('water-pump', 'off');
    });

    it('debe deshabilitar los botones de encendido y apagado cuando no se puede controlar la bomba', () => {
        render(<PumpControlCard pumpMode="automatico" waterLevel="Sin agua" pumpStatus="apagado" />);

        const turnOnButton = screen.getByRole('button', { name: /Encender Bomba/i });
        const turnOffButton = screen.getByRole('button', { name: /Apagar Bomba/i });

        // Verifica que ambos botones están deshabilitados
        expect(turnOnButton).toBeDisabled();
        expect(turnOffButton).toBeDisabled();
    });

    it('debe mostrar un mensaje de advertencia cuando no hay agua disponible', () => {
        render(<PumpControlCard pumpMode="manual" waterLevel="Sin agua" pumpStatus="apagado" />);

        const warningMessage = screen.getByText(/No hay agua disponible para operar la bomba/i);
        expect(warningMessage).toBeInTheDocument();
    });

    it('debe mostrar un mensaje de advertencia cuando no está en modo manual', () => {
        render(<PumpControlCard pumpMode="automatico" waterLevel="Con agua" pumpStatus="apagado" />);

        const warningMessage = screen.getByText(/Cambie a modo manual para controlar la bomba/i);
        expect(warningMessage).toBeInTheDocument();
    });
});
