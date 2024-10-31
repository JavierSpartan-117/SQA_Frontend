import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PumpStatusCard from '../../src/components/PumpStatusCard';

describe('PumpStatusCard', () => {
    it('debe mostrar "Encendida" cuando la bomba está en estado encendido', () => {
        render(<PumpStatusCard pumpStatus="encendido" pumpMode="manual" />);

        // Verifica que el estado "Encendida" se muestra en el DOM
        const statusText = screen.getByText(/Encendida/i);
        expect(statusText).toBeInTheDocument();
    });

    it('debe mostrar "Apagada" cuando la bomba está en estado apagado', () => {
        render(<PumpStatusCard pumpStatus="apagado" pumpMode="manual" />);

        // Verifica que el estado "Apagada" se muestra en el DOM
        const statusText = screen.getByText(/Apagada/i);
        expect(statusText).toBeInTheDocument();
    });

    it('no debe mostrar el mensaje de activación automática cuando la bomba está apagada en modo automático', () => {
        render(<PumpStatusCard pumpStatus="apagado" pumpMode="automatico" />);

        // Verifica que el mensaje de activación automática no se muestra
        const autoActivationMessage = screen.queryByText(/La bomba se ha activado automáticamente/i);
        expect(autoActivationMessage).not.toBeInTheDocument();
    });
});
