import { connectDB } from '../config/database';
import { Vehicle } from '../models/Vehicle';
import { User } from '../models/User';
import fs from 'fs';
import path from 'path';

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

    // Load vehicle data from JSON file
    const vehiclesPath = path.join(__dirname, '../../assets/carros.json');
    const vehiclesData = JSON.parse(fs.readFileSync(vehiclesPath, 'utf8')) as VehicleData[];

    // Clear existing vehicles
    await Vehicle.deleteMany({});
    console.log('🗑️ Veículos existentes removidos');

    // Create vehicles with images
    const vehicleImages = [
      'Imagem 9.png',
      'Imagem 15.png',
      'Imagem 16.png',
      'Imagem 18.png',
      'Imagem 19.png',
      'Imagem 20.png',
      'Imagem 22.png',
      'Imagem 23.png',
      'Imagem 25.png',
      'Imagem 26.png',
      'Imagem 27.png',
      'Imagem 28.png'
    ];

    const vehicles = vehiclesData.map((vehicleData, index) => ({
      name: vehicleData.name,
      year: vehicleData.year,
      type: vehicleData.type,
      engine: vehicleData.engine,
      size: vehicleData.size,
      imageUrl: `/assets/images/${vehicleImages[index]}`,
      isAvailable: true
    }));

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
    const existingAdmin = await User.findOne({ email: 'admin@veiclereserva.com' });
    if (existingAdmin) {
      console.log('👤 Usuário administrador já existe');
      return;
    }

    // Create admin user
    const adminUser = new User({
      name: 'Administrador',
      email: 'admin@veiclereserva.com',
      password: 'admin123'
    });

    await adminUser.save();
    console.log('✅ Usuário administrador criado com sucesso');
    console.log('📧 Email: admin@veiclereserva.com');
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
