package com.medifind.service;

import com.medifind.model.Pharmacy;
import com.medifind.repository.PharmacyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PharmacyService {

    private final PharmacyRepository pharmacyRepository;
    private final DistanceCalculationService distanceCalculationService;

    @Autowired
    public PharmacyService(PharmacyRepository pharmacyRepository,
                           DistanceCalculationService distanceCalculationService) {
        this.pharmacyRepository = pharmacyRepository;
        this.distanceCalculationService = distanceCalculationService;
    }

    public List<Pharmacy> getAllPharmacies(Double userLat, Double userLng, Double maxRadiusKm, boolean activeOnly) {
        List<Pharmacy> list = activeOnly ? pharmacyRepository.findByIsActiveTrue() : pharmacyRepository.findAll();

        if (userLat != null && userLng != null) {
            for (Pharmacy p : list) {
                double dist = distanceCalculationService.calculateDistanceKm(
                        userLat, userLng,
                        p.getLatitude().doubleValue(),
                        p.getLongitude().doubleValue()
                );
                p.setDistanceKm(dist);
            }

            if (maxRadiusKm != null) {
                list = list.stream()
                        .filter(p -> p.getDistanceKm() != null && p.getDistanceKm() <= maxRadiusKm)
                        .collect(Collectors.toList());
            }

            list.sort(Comparator.comparing(Pharmacy::getDistanceKm, Comparator.nullsLast(Double::compareTo)));
        }

        return list;
    }

    public Optional<Pharmacy> getPharmacyById(Long id) {
        return pharmacyRepository.findById(id);
    }

    @Transactional
    public Pharmacy createPharmacy(Pharmacy pharmacy) {
        pharmacy.setIsActive(true);
        if (pharmacy.getVerificationStatus() == null) {
            pharmacy.setVerificationStatus("DEMONSTRATION_RECORD");
        }
        return pharmacyRepository.save(pharmacy);
    }

    @Transactional
    public Optional<Pharmacy> updatePharmacy(Long id, Pharmacy updated) {
        return pharmacyRepository.findById(id).map(existing -> {
            existing.setName(updated.getName());
            existing.setAddressLine(updated.getAddressLine());
            existing.setLocality(updated.getLocality());
            existing.setCity(updated.getCity());
            existing.setPinCode(updated.getPinCode());
            existing.setLatitude(updated.getLatitude());
            existing.setLongitude(updated.getLongitude());
            existing.setContactPhone(updated.getContactPhone());
            existing.setOpeningTime(updated.getOpeningTime());
            existing.setClosingTime(updated.getClosingTime());
            existing.setIs24Hours(updated.getIs24Hours());
            return pharmacyRepository.save(existing);
        });
    }

    @Transactional
    public boolean deactivatePharmacy(Long id) {
        return pharmacyRepository.findById(id).map(p -> {
            p.setIsActive(false);
            pharmacyRepository.save(p);
            return true;
        }).orElse(false);
    }
}
