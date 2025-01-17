#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

#define MAX_CHAMBRES 100
#define MAX_RESERVATIONS 100

// Structures
typedef struct {
    int numero;
    char type[20];
    double prix_par_nuit;
} Chambre;

typedef struct {
    char nom[50];
    char prenom[50];
    struct tm date_arrivee;
    struct tm date_depart;
    int numero_chambre;
} Reservation;

// Variables globales
Chambre chambres[MAX_CHAMBRES];
int nombre_chambres = 0;

Reservation reservations[MAX_RESERVATIONS];
int nombre_reservations = 0;

// Fonctions utilitaires
int comparer_dates(struct tm d1, struct tm d2) {
    return mktime(&d1) - mktime(&d2);
}

int est_chevauchement(struct tm d1_debut, struct tm d1_fin, struct tm d2_debut, struct tm d2_fin) {
    return !(comparer_dates(d1_fin, d2_debut) < 0 || comparer_dates(d2_fin, d1_debut) < 0);
}

void afficher_date(struct tm date) {
    printf("%02d/%02d/%04d", date.tm_mday, date.tm_mon + 1, date.tm_year + 1900);
}

void lire_date(struct tm *date) {
    int jour, mois, annee;
    printf("Entrez la date (jour mois annee) : ");
    scanf("%d %d %d", &jour, &mois, &annee);
    date->tm_mday = jour;
    date->tm_mon = mois - 1;
    date->tm_year = annee - 1900;
    date->tm_hour = 0;
    date->tm_min = 0;
    date->tm_sec = 0;
    mktime(date);
}

// Gestion des chambres
void ajouter_chambre(int numero, char *type, double prix_par_nuit) {
    chambres[nombre_chambres].numero = numero;
    strcpy(chambres[nombre_chambres].type, type);
    chambres[nombre_chambres].prix_par_nuit = prix_par_nuit;
    nombre_chambres++;
}

void afficher_chambres_disponibles(struct tm debut, struct tm fin) {
    printf("Chambres disponibles :\n");
    for (int i = 0; i < nombre_chambres; i++) {
        int disponible = 1;
        for (int j = 0; j < nombre_reservations; j++) {
            if (reservations[j].numero_chambre == chambres[i].numero &&
                est_chevauchement(debut, fin, reservations[j].date_arrivee, reservations[j].date_depart)) {
                disponible = 0;
                break;
            }
        }
        if (disponible) {
            printf("Chambre %d (%s) - %.2f €/nuit\n", chambres[i].numero, chambres[i].type, chambres[i].prix_par_nuit);
        }
    }
}

// Gestion des reservations
void ajouter_reservation() {
    if (nombre_reservations >= MAX_RESERVATIONS) {
        printf("Nombre maximum de réservations atteint.\n");
        return;
    }

    Reservation nouvelle;
    printf("Nom : ");
    scanf("%s", nouvelle.nom);
    printf("Prénom : ");
    scanf("%s", nouvelle.prenom);

    printf("Date d'arrivée :\n");
    lire_date(&nouvelle.date_arrivee);
    printf("Date de départ :\n");
    lire_date(&nouvelle.date_depart);

    afficher_chambres_disponibles(nouvelle.date_arrivee, nouvelle.date_depart);

    printf("Choisissez un numéro de chambre disponible : ");
    scanf("%d", &nouvelle.numero_chambre);

    reservations[nombre_reservations++] = nouvelle;
    printf("Réservation ajoutée avec succès !\n");
}

void annuler_reservation() {
    char nom[50], prenom[50];
    printf("Nom : ");
    scanf("%s", nom);
    printf("Prénom : ");
    scanf("%s", prenom);

    for (int i = 0; i < nombre_reservations; i++) {
        if (strcmp(reservations[i].nom, nom) == 0 && strcmp(reservations[i].prenom, prenom) == 0) {
            for (int j = i; j < nombre_reservations - 1; j++) {
                reservations[j] = reservations[j + 1];
            }
            nombre_reservations--;
            printf("Réservation annulée avec succès.\n");
            return;
        }
    }
    printf("Réservation non trouvée.\n");
}

void afficher_reservations() {
    printf("Réservations en cours :\n");
    for (int i = 0; i < nombre_reservations; i++) {
        printf("%s %s - Chambre %d - Du ", reservations[i].nom, reservations[i].prenom, reservations[i].numero_chambre);
        afficher_date(reservations[i].date_arrivee);
        printf(" au ");
        afficher_date(reservations[i].date_depart);
        printf("\n");
    }
}

void rechercher_reservation() {
    char nom[50], prenom[50];
    printf("Nom : ");
    scanf("%s", nom);
    printf("Prénom : ");
    scanf("%s", prenom);

    for (int i = 0; i < nombre_reservations; i++) {
        if (strcmp(reservations[i].nom, nom) == 0 && strcmp(reservations[i].prenom, prenom) == 0) {
            printf("Réservation trouvée : Chambre %d - Du ", reservations[i].numero_chambre);
            afficher_date(reservations[i].date_arrivee);
            printf(" au ");
            afficher_date(reservations[i].date_depart);
            printf("\n");
            return;
        }
    }
    printf("Réservation non trouvée.\n");
}

void sauvegarder_reservations() {
    FILE *fichier = fopen("reservations.dat", "wb");
    if (fichier == NULL) {
        printf("Erreur lors de l'ouverture du fichier.\n");
        return;
    }
    fwrite(&nombre_reservations, sizeof(int), 1, fichier);
    fwrite(reservations, sizeof(Reservation), nombre_reservations, fichier);
    fclose(fichier);
    printf("Réservations sauvegardées avec succès.\n");
}

void charger_reservations() {
    FILE *fichier = fopen("reservations.dat", "rb");
    if (fichier == NULL) {
        printf("Aucune réservation à charger.\n");
        return;
    }
    fread(&nombre_reservations, sizeof(int), 1, fichier);
    fread(reservations, sizeof(Reservation), nombre_reservations, fichier);
    fclose(fichier);
    printf("Réservations chargées avec succès.\n");
}

// Menu principal
void afficher_menu() {
    printf("\nMenu:\n");
    printf("1. Ajouter une nouvelle réservation\n");
    printf("2. Annuler une réservation\n");
    printf("3. Afficher les réservations en cours\n");
    printf("4. Rechercher une réservation\n");
    printf("5. Afficher les chambres disponibles\n");
    printf("6. Sauvegarder les réservations\n");
    printf("7. Quitter\n");
    printf("Choisissez une option : ");
}

int main() {
    charger_reservations();

    // Exemple de chambres préconfigurées
    ajouter_chambre(101, "Simple", 50.0);
    ajouter_chambre(102, "Double", 80.0);
    ajouter_chambre(103, "Suite", 150.0);

    int choix;
    do {
        afficher_menu();
        scanf("%d", &choix);
        switch (choix) {
            case 1:
                ajouter_reservation();
                break;
            case 2:
                annuler_reservation();
                break;
            case 3:
                afficher_reservations();
                break;
            case 4:
                rechercher_reservation();
                break;
            case 5: {
                struct tm debut, fin;
                printf("Date de début :\n");
                lire_date(&debut);
                printf("Date de fin :\n");
                lire_date(&fin);
                afficher_chambres_disponibles(debut, fin);
                break;
            }
            case 6:
                sauvegarder_reservations();
                break;
            case 7:
                printf("Au revoir !\n");
                break;
            default:
                printf("Option invalide.\n");
        }
    } while (choix != 7);

    return 0;
}
