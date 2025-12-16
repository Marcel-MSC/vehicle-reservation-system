import { connectDB } from '../config/database';
import { Vehicle } from '../models/Vehicle';
import { User } from '../models/User';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

interface VehicleData {
  name: string;
  year: string;
  type: string;
  engine: string;
  size: string;
}

const seedVehicles = async (): Promise<void> => {
  try {
    console.log('🌱 Iniciando seed de veículos...');

    // Carrega os dados dos veículos e as imagens dinamicamente
    const assetsPath = path.join(__dirname, '../../../assets');
    const vehiclesPath = path.join(assetsPath, 'carros.json');
    const vehiclesData = JSON.parse(fs.readFileSync(vehiclesPath, 'utf8')) as VehicleData[];

    // Mapeamento específico das imagens baseado no nome do veículo
    const imageMapping: { [key: string]: string } = {
      'Imagem 9.png': 'Ford Ká Hatch',
      'Imagem 15.png': 'Renault Duster',
      'Imagem 16.png': 'Jeep Compass Longitude',
      'Imagem 18.png': 'Caoa Chery Tiggo',
      'Imagem 19.png': 'Volkswagen T-Cross',
      'Imagem 20.png': 'Chevrolet Camaro',
      'Imagem 22.png': 'Fiat Strada',
      'Imagem 23.png': 'Volkswagen Saveiro Robust',
      'Imagem 25.png': 'Fiat Toro',
      'Imagem 26.png': 'Ford Ká Sedan',
      'Imagem 27.png': 'Nissan Versa',
      'Imagem 28.png': 'Jetta',
      'Imagem 29.png': 'Fiat Doblo',
      'Imagem 30.png': 'Fiat Fiorino',
      'Imagem 31.png': 'Peugeot Partner',
      'Imagem 32.png': 'Mini John Cooper Works'
    };

    // Clear existing vehicles
    await Vehicle.deleteMany({});
    console.log('🗑️ Veículos existentes removidos');

    const vehicles = vehiclesData.map((vehicleData) => {
      // Encontra a imagem correspondente baseada no nome do veículo
      const imageFileName = Object.keys(imageMapping).find(key => imageMapping[key] === vehicleData.name);

      return {
        name: vehicleData.name,
        year: vehicleData.year,
        type: vehicleData.type,
        engine: vehicleData.engine,
        size: vehicleData.size,
        imageUrl: imageFileName ? `http://localhost:3000/assets/Carros/${imageFileName}` : `http://localhost:3000/assets/Carros/default-car.jpg`,
        isAvailable: true
      };
    });

    const createdVehicles = await Vehicle.insertMany(vehicles);
    console.log(`✅ ${createdVehicles.length} veículos criados com sucesso`);

    // Display created vehicles
    createdVehicles.forEach((vehicle, index) => {
      console.log(`${index + 1}. ${vehicle.name} (${vehicle.year}) - ${vehicle.type}`);
    });

  } catch (error) {
    console.error('❌ Erro ao popular veículos:', error);
  }
};

const seedAdminUser = async (): Promise<void> => {
  try {
    console.log('🌱 Criando usuário administrador...');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@vehiclereservation.com' });
    if (existingAdmin) {
      console.log('👤 Usuário administrador já existe');
      return;
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    // Create admin user
    const adminUser = new User({
      name: 'Administrador',
      email: 'admin@vehiclereservation.com',
      password: hashedPassword,
      role: 'admin'
    });

    await adminUser.save();
    console.log('✅ Usuário administrador criado com sucesso');
    console.log('📧 Email: admin@vehiclereservation.com');
    console.log('🔑 Senha: admin123');

  } catch (error) {
    console.error('❌ Erro ao criar usuário administrador:', error);
  }
};

const runSeeds = async (): Promise<void> => {
  try {
    // Connect to database
    await connectDB();
    console.log('🔗 Conectado ao MongoDB');

    // Run seeds
    await seedVehicles();
    await seedAdminUser();

    console.log('🎉 Seed concluído com sucesso!');
    
    // Disconnect from database
    await (await import('../config/database')).disconnectDB();
    console.log('🔌 Desconectado do MongoDB');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
    process.exit(1);
  }
};

// Run seeds if this file is executed directly
if (require.main === module) {
  runSeeds();
}

export { seedVehicles, seedAdminUser };
