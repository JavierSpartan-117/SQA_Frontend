import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PumpStatusCard from '../../src/components/PumpStatusCard';

describe('PumpStatusCard', () => {
    it('debe mostrar "Encendida" cuando la bomba está en estado encendido', () => {
        render(<PumpStatusCard pumpStatus="encendido" pumpMode="manual" />);

        const statusText = screen.getByText(/Encendida/i);
        expect(statusText).toBeInTheDocument();
    });

    it('debe mostrar "Apagada" cuando la bomba está en estado apagado', () => {
        render(<PumpStatusCard pumpStatus="apagado" pumpMode="manual" />);

        const statusText = screen.getByText(/Apagada/i);
        expect(statusText).toBeInTheDocument();
    });

    it('no debe mostrar el mensaje de activación automática cuando la bomba está apagada en modo automático', () => {
        render(<PumpStatusCard pumpStatus="apagado" pumpMode="automatico" />);

        const autoActivationMessage = screen.queryByText(/La bomba se ha activado automáticamente/i);
        expect(autoActivationMessage).not.toBeInTheDocument();
    });
});
