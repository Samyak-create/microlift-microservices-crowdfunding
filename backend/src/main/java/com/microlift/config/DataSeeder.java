package com.microlift.config;

import com.microlift.model.Campaign;
import com.microlift.model.User;
import com.microlift.repository.CampaignRepository;
import com.microlift.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import com.microlift.model.Document;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CampaignRepository campaignRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        try {
            // Create Admin User (if not exists)
            userRepository.findByEmail("admin@microlift.com")
                    .orElseGet(() -> {
                        User admin = User.builder()
                                .fullName("Admin User")
                                .email("admin@microlift.com")
                                .password(passwordEncoder.encode("admin123"))
                                .role(User.Role.ADMIN)
                                .phoneNumber("1234567890")
                                .build();
                        System.out.println("✅ Admin user created: admin@microlift.com / admin123");
                        return userRepository.save(admin);
                    });

            if (campaignRepository.count() < 10) {
                // Create Beneficiary
                User beneficiary = userRepository.findByEmail("beneficiary@example.com")
                        .orElseGet(() -> {
                            User newUser = User.builder()
                                    .fullName("Ramesh Kumar")
                                    .email("beneficiary@example.com")
                                    .password(passwordEncoder.encode("password"))
                                    .role(User.Role.BENEFICIARY)
                                    .phoneNumber("9876543210")
                                    .build();
                            return userRepository.save(newUser);
                        });

                List<Campaign> campaigns = new ArrayList<>();

                campaigns.add(Campaign.builder()
                        .title("Medical Help for Heart Surgery")
                        .description("Urgent funds needed for open heart surgery for a 5-year-old child. Every rupee counts.")
                        .goalAmount(500000.0).raisedAmount(120000.0)
                        .category(Campaign.Category.MEDICAL).status(Campaign.Status.ACTIVE)
                        .location("Mumbai, India").endDate(LocalDate.now().plusDays(30))
                        .beneficiary(beneficiary)
                        .imageUrl("https://images.unsplash.com/photo-1511174511562-5f7f18b874f8").build());

                campaigns.add(Campaign.builder()
                        .title("Education Support for Poor Kids")
                        .description("Providing textbooks, uniforms, and tuition fees for underprivileged children in rural Maharashtra.")
                        .goalAmount(200000.0).raisedAmount(45000.0)
                        .category(Campaign.Category.EDUCATION).status(Campaign.Status.ACTIVE)
                        .location("Pune, India").endDate(LocalDate.now().plusDays(60))
                        .beneficiary(beneficiary)
                        .imageUrl("https://images.unsplash.com/photo-1503676260728-1c00da094a0b").build());



                campaigns.add(Campaign.builder()
                        .title("Medical Help for Heart Surgery")
                        .description("Urgent funds needed for open heart surgery for a 5-year-old child. Every rupee counts.")
                        .goalAmount(500000.0).raisedAmount(120000.0)
                        .category(Campaign.Category.MEDICAL).status(Campaign.Status.ACTIVE)
                        .location("Mumbai, India").endDate(LocalDate.now().plusDays(30))
                        .beneficiary(beneficiary)
                        .imageUrl("https://images.unsplash.com/photo-1511174511562-5f7f18b874f8").build());

                campaigns.add(Campaign.builder()
                        .title("Education Support for Poor Kids")
                        .description("Providing textbooks, uniforms, and tuition fees for underprivileged children in rural Maharashtra.")
                        .goalAmount(200000.0).raisedAmount(45000.0)
                        .category(Campaign.Category.EDUCATION).status(Campaign.Status.ACTIVE)
                        .location("Pune, India").endDate(LocalDate.now().plusDays(60))
                        .beneficiary(beneficiary)
                        .imageUrl("https://images.unsplash.com/photo-1503676260728-1c00da094a0b").build());

                campaigns.add(Campaign.builder()
                        .title("Disaster Relief Fund")
                        .description("Helping flood victims recreate their homes and lives after the devastating monsoon.")
                        .goalAmount(1000000.0).raisedAmount(15000.0)
                        .category(Campaign.Category.EMERGENCY).status(Campaign.Status.ACTIVE)
                        .location("Kerala, India").endDate(LocalDate.now().plusDays(15))
                        .beneficiary(beneficiary)
                        .imageUrl("https://images.unsplash.com/photo-1469571486292-0ba58a3f068b").build());

                campaigns.add(Campaign.builder()
                        .title("Clean Water for Village")
                        .description("Installing water purifiers and building wells in drought-prone areas.")
                        .goalAmount(300000.0).raisedAmount(50000.0)
                        .category(Campaign.Category.ENVIRONMENT).status(Campaign.Status.ACTIVE)
                        .location("Rajasthan, India").endDate(LocalDate.now().plusDays(45))
                        .beneficiary(beneficiary)
                        .imageUrl("https://images.unsplash.com/photo-1538300342682-cf57afb97285").build());

                campaigns.add(Campaign.builder()
                        .title("Cancer Treatment Support")
                        .description("Financial aid for chemotherapy and medication for breast cancer patients.")
                        .goalAmount(800000.0).raisedAmount(200000.0)
                        .category(Campaign.Category.MEDICAL).status(Campaign.Status.ACTIVE)
                        .location("Delhi, India").endDate(LocalDate.now().plusDays(20))
                        .beneficiary(beneficiary)
                        .imageUrl("https://images.unsplash.com/photo-1579684385127-1ef15d508118").build());

                campaigns.add(Campaign.builder()
                        .title("Feed the Homeless")
                        .description("Daily food drives to feed 500 homeless people in the city.")
                        .goalAmount(100000.0).raisedAmount(80000.0)
                        .category(Campaign.Category.OTHER).status(Campaign.Status.ACTIVE)
                        .location("Bangalore, India").endDate(LocalDate.now().plusDays(10))
                        .beneficiary(beneficiary)
                        .imageUrl("https://images.unsplash.com/photo-1488521787991-ed7bbaae773c").build());

                campaigns.add(Campaign.builder()
                        .title("Plant 10,000 Trees")
                        .description("Reforestation drive to combat climate change and increase green cover.")
                        .goalAmount(250000.0).raisedAmount(10000.0)
                        .category(Campaign.Category.ENVIRONMENT).status(Campaign.Status.ACTIVE)
                        .location("Uttarakhand, India").endDate(LocalDate.now().plusDays(90))
                        .beneficiary(beneficiary)
                        .imageUrl("https://images.unsplash.com/photo-1542601906990-b4d3fb778b09").build());

                campaigns.add(Campaign.builder()
                        .title("Animal Shelter Support")
                        .description("Rescuing and providing shelter for stray dogs and cats.")
                        .goalAmount(150000.0).raisedAmount(30000.0)
                        .category(Campaign.Category.OTHER).status(Campaign.Status.ACTIVE)
                        .location("Goa, India").endDate(LocalDate.now().plusDays(40))
                        .beneficiary(beneficiary)
                        .imageUrl("https://images.unsplash.com/photo-1548199973-03cce0bbc87b").build());

                campaigns.add(Campaign.builder()
                        .title("Digital Literacy for Women")
                        .description("Providing laptops and internet training to empower rural women.")
                        .goalAmount(400000.0).raisedAmount(100000.0)
                        .category(Campaign.Category.EDUCATION).status(Campaign.Status.ACTIVE)
                        .location("Hyderabad, India").endDate(LocalDate.now().plusDays(50))
                        .beneficiary(beneficiary)
                        .imageUrl("https://images.unsplash.com/photo-1573496359142-b8d87734a5a2").build());

                campaigns.add(Campaign.builder()
                        .title("Digital Classroom for Rural School")
                        .description("Help us equip a rural school in Bihar with computers and internet access to bridge the digital divide.")
                        .goalAmount(150000.0).raisedAmount(45000.0)
                        .category(Campaign.Category.EDUCATION).status(Campaign.Status.ACTIVE)
                        .location("Patna, India").endDate(LocalDate.now().plusDays(40))
                        .beneficiary(beneficiary)
                        .imageUrl("https://images.unsplash.com/photo-1516321318423-f06f85e504b3").build());

                campaigns.add(Campaign.builder()
                        .title("Emergency Cancer Treatment for Sunita")
                        .description("Sunita is a single mother battling breast cancer. She needs urgent chemotherapy and radiation.")
                        .goalAmount(500000.0).raisedAmount(125000.0)
                        .category(Campaign.Category.MEDICAL).status(Campaign.Status.ACTIVE)
                        .location("Bangalore, India").endDate(LocalDate.now().plusDays(30))
                        .beneficiary(beneficiary)
                        .imageUrl("https://images.unsplash.com/photo-1579154204601-01588f351e67").build());

                campaigns.add(Campaign.builder()
                        .title("Emergency Ambulance Service")
                        .description("Funding a new ambulance for rapid emergency response in tribal areas.")
                        .goalAmount(1200000.0).raisedAmount(500000.0)
                        .category(Campaign.Category.MEDICAL).status(Campaign.Status.ACTIVE)
                        .location("Chhattisgarh, India").endDate(LocalDate.now().plusDays(25))
                        .beneficiary(beneficiary)
                        .imageUrl("https://images.unsplash.com/photo-1587745416684-47953f16f0ae").build());

                List<Campaign> savedCampaigns = campaignRepository.saveAll(campaigns);
                System.out.println("Seeded " + savedCampaigns.size() + " campaigns.");
                
                // Add Documents to specific campaigns
                if (savedCampaigns.size() >= 12) {
                     // Sunita (index 10)
                     Campaign sunita = savedCampaigns.get(10);
                     sunita.getDocuments().add(Document.builder().name("Medical Diagnosis Report").url("http://example.com/med_report.pdf")
                            .status(Document.Status.VERIFIED).campaign(sunita).build());
                     sunita.getDocuments().add(Document.builder().name("Hospital Estimate").url("http://example.com/estimate.pdf")
                            .status(Document.Status.PENDING).campaign(sunita).build());
                            
                     Campaign digitalClass = savedCampaigns.get(9);
                     digitalClass.getDocuments().add(Document.builder().name("School Registration").url("http://example.com/school_reg.pdf")
                            .status(Document.Status.VERIFIED).campaign(digitalClass).build());
                     
                     campaignRepository.saveAll(savedCampaigns);
                     System.out.println("Seeded documents for NEW campaigns.");
                }
            }
            
            // Ensure documents exist for key campaigns even if seeder didn't run (e.g. data already existed)
            List<Campaign> allCampaigns = campaignRepository.findAll();
            allCampaigns.stream()
                .filter(c -> c.getTitle().contains("Sunita"))
                .findFirst()
                .ifPresent(sunita -> {
                    if (sunita.getDocuments().isEmpty()) {
                         sunita.getDocuments().add(Document.builder().name("Medical Diagnosis Report").url("http://example.com/med_report.pdf")
                                .status(Document.Status.VERIFIED).campaign(sunita).build());
                         sunita.getDocuments().add(Document.builder().name("Hospital Estimate").url("http://example.com/estimate.pdf")
                                .status(Document.Status.PENDING).campaign(sunita).build());
                         campaignRepository.save(sunita);
                         System.out.println("✅ Added missing documents to Sunita campaign.");
                    }
                });

        } catch (Exception e) {
            System.out.println("Data Seeding Failed: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
