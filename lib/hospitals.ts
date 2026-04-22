// lib/hospitals.ts
import { CaseType } from "./recommendation";

export interface Hospital {
  id: string;
  name: string;
  shortName: string;
  type: "Government" | "Private";
  specialtyLabel: string;
  specialties: CaseType[];
  supportsEmergency: boolean;
  supportsTrauma: boolean;
  supportsCardiac: boolean;
  supportsStroke: boolean;
  supportsPediatric: boolean;
  distanceKm: number;
  travelTimeMin: number;
  availability: "High" | "Medium" | "Low";
  features: string[];
  lat: number;
  lng: number;
}

export const HOSPITALS: Hospital[] = [
  {
    id: "skmc",
    name: "Sheikh Khalifa Medical City",
    shortName: "SKMC",
    type: "Government",
    specialtyLabel: "Cardiac & Stroke Centre of Excellence",
    specialties: ["cardiac", "stroke", "other"],
    supportsEmergency: true,
    supportsTrauma: true,
    supportsCardiac: true,
    supportsStroke: true,
    supportsPediatric: true,
    distanceKm: 1.4,
    travelTimeMin: 6,
    availability: "High",
    features: ["Advanced Cath Lab", "Stroke tPA Unit", "Pediatric ER", "24/7 Cardiac Team"],
    lat: 24.4752,
    lng: 54.3685,
  },
  {
    id: "ccad",
    name: "Cleveland Clinic Abu Dhabi",
    shortName: "CCAD",
    type: "Private",
    specialtyLabel: "Multi-Speciality Academic Centre",
    specialties: ["cardiac", "stroke", "other"],
    supportsEmergency: true,
    supportsTrauma: false,
    supportsCardiac: true,
    supportsStroke: true,
    supportsPediatric: false,
    distanceKm: 3.2,
    travelTimeMin: 13,
    availability: "Medium",
    features: ["Robotic Surgery", "Neuroscience Institute", "Transplant Centre", "Aortic Clinic"],
    lat: 24.5024,
    lng: 54.3891,
  },
  {
    id: "burjeel",
    name: "Burjeel Medical City",
    shortName: "BMC",
    type: "Private",
    specialtyLabel: "Level 1 Trauma & Tertiary care",
    specialties: ["trauma", "other"],
    supportsEmergency: true,
    supportsTrauma: true,
    supportsCardiac: false,
    supportsStroke: false,
    supportsPediatric: true,
    distanceKm: 2.1,
    travelTimeMin: 9,
    availability: "High",
    features: ["Level 1 Trauma Bay", "Comprehensive Oncology", "Rehabilitation Centre", "Spine Surgery"],
    lat: 24.3168,
    lng: 54.5422,
  },
  {
    id: "al-zahra",
    name: "Al Zahra Hospital",
    shortName: "AZH",
    type: "Private",
    specialtyLabel: "Community Multi-Speciality",
    specialties: ["other"],
    supportsEmergency: true,
    supportsTrauma: false,
    supportsCardiac: false,
    supportsStroke: false,
    supportsPediatric: true,
    distanceKm: 2.7,
    travelTimeMin: 12,
    availability: "Medium",
    features: ["Mother & Child Care", "General Internal Medicine", "Diabetes Centre", "Family Medicine"],
    lat: 24.4691,
    lng: 54.3982,
  },
  {
    id: "universal",
    name: "Universal Hospital",
    shortName: "UNH",
    type: "Private",
    specialtyLabel: "General Secondary Care",
    specialties: ["other"],
    supportsEmergency: true,
    supportsTrauma: false,
    supportsCardiac: false,
    supportsStroke: false,
    supportsPediatric: false,
    distanceKm: 4.5,
    travelTimeMin: 18,
    availability: "High",
    features: ["Multi-lingual Staff", "Outpatient Clinics", "Health Checkups", "Physiotherapy"],
    lat: 24.4815,
    lng: 54.3582,
  },
];
