<script setup lang="ts">
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonPage, IonProgressBar, IonRow, IonText, IonTitle, IonToolbar } from '@ionic/vue';

import { useAlbum } from '../composables/useAlbum'

const { totalFigurinhas, figurinhasColetadas, percentualCompleto } = useAlbum()
</script>

<template>
    <IonPage>
        <AppHeader />

        <IonContent :fullscreen="true">
            <IonHeader collapse="condense">
                <IonToolbar>
                    <IonTitle size="large">Meu Álbum da Copa</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonCard class="ion-margin">
                <IonCardHeader>
                    <IonCardTitle>Resumo do Álbum</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                    <IonGrid>
                        <IonRow>
                            <IonCol size="12" size-sm="6" size-md="4">
                                <div class="ion-text-center">
                                    <IonText color="primary">
                                        <h2>{{ totalFigurinhas }}</h2>
                                        <p>Total de Figurinhas</p>
                                    </IonText>
                                </div>
                            </IonCol>
                            <IonCol size="12" size-sm="6" size-md="4">
                                <div class="ion-text-center">
                                    <IonText color="success">
                                        <h2>{{ figurinhasColetadas }}</h2>
                                        <p>Coletadas</p>
                                    </IonText>
                                </div>
                            </IonCol>
                            <IonCol size="12" size-sm="6" size-md="4">
                                <div class="ion-text-center">
                                    <IonText color="warning">
                                        <h2>{{ percentualCompleto }}%</h2>
                                        <p>Progresso</p>
                                    </IonText>
                                </div>
                            </IonCol>
                        </IonRow>
                    </IonGrid>

                    <IonProgressBar :value="percentualCompleto / 100" color="success" class="ion-maring-top"/>
                </IonCardContent>
            </IonCard>

            <StickerList/>
        </IonContent>
    </IonPage>
</template>