-- Create tables for Payroll Microservice

-- Companies table (datos quemados)
CREATE TABLE IF NOT EXISTS companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    nit VARCHAR(50) NOT NULL UNIQUE,
    address VARCHAR(255),
    phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payrolls table
CREATE TABLE IF NOT EXISTS payrolls (
    id SERIAL PRIMARY KEY,
    user_document VARCHAR(50) NOT NULL,
    company_id INTEGER NOT NULL,
    position VARCHAR(100),
    status VARCHAR(20) NOT NULL CHECK (status IN ('activo', 'retirado')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_payroll_user_document ON payrolls(user_document);
CREATE INDEX idx_payroll_company_id ON payrolls(company_id);
CREATE INDEX idx_payroll_status ON payrolls(status);

-- Insert default companies (datos quemados)
INSERT INTO companies (name, nit, address, phone) VALUES
    ('Tech Solutions S.A.S', '900123456-7', 'Calle 100 #10-20, Bogotá', '+57 1 234 5678'),
    ('Innovación Digital Ltda', '800987654-3', 'Carrera 15 #85-40, Bogotá', '+57 1 876 5432'),
    ('Servicios Empresariales Colombia', '700456789-1', 'Avenida 68 #45-30, Bogotá', '+57 1 345 6789'),
    ('Consultoría Integral S.A.', '600321654-9', 'Calle 72 #10-34, Bogotá', '+57 1 654 3210'),
    ('Desarrollo y Tecnología', '500789123-4', 'Carrera 7 #32-16, Bogotá', '+57 1 789 0123')
ON CONFLICT (nit) DO NOTHING;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$ LANGUAGE plpgsql;

-- Trigger for payrolls table
CREATE TRIGGER update_payrolls_updated_at
    BEFORE UPDATE ON payrolls
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();