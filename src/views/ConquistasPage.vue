<script setup lang="ts">
import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonProgressBar,
  IonText,
  IonTitle,
  IonToolbar,
  onIonViewWillEnter,
} from '@ionic/vue'
import { checkmarkCircleOutline, lockClosedOutline, sparklesOutline } from 'ionicons/icons'
import { computed } from 'vue'
import { useConquistas } from '../services/database'

const {
  conquistasUsuario,
  conquistasDesbloqueadas,
  percentualConquistas,
  atualizarConquistas,
} = useConquistas()

const totalConquistas = computed(() => conquistasUsuario.value.length)

onIonViewWillEnter(() => {
  atualizarConquistas()
})
</script>

<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Conquistas</IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent class="ion-padding">
      <IonCard class="hero-card ion-margin-bottom">
        <IonCardHeader>
          <IonCardSubtitle>Seu progresso</IonCardSubtitle>
          <IonCardTitle>Desbloqueie marcos da coleção</IonCardTitle>
        </IonCardHeader>

        <IonCardContent>
          <div class="hero-stats">
            <div>
              <IonText color="light">
                <p>Conquistas desbloqueadas</p>
                <h2>{{ conquistasDesbloqueadas }}</h2>
              </IonText>
            </div>
            <IonBadge color="warning">{{ percentualConquistas }}%</IonBadge>
          </div>

          <IonProgressBar :value="percentualConquistas / 100" color="warning" />
        </IonCardContent>
      </IonCard>

      <IonCard class="ion-margin-bottom">
        <IonCardContent>
          <IonText color="medium">
            <p>Total de conquistas registradas no sistema: {{ totalConquistas }}</p>
          </IonText>
        </IonCardContent>
      </IonCard>

      <section class="conquistas-lista">
        <IonCard
          v-for="conquista in conquistasUsuario"
          :key="conquista.codigo"
          class="achievement-card"
          :class="{ desbloqueada: conquista.desbloqueada }"
        >
          <IonCardContent>
            <div class="achievement-head">
              <div class="achievement-icon" :class="{ desbloqueada: conquista.desbloqueada }">
                <IonIcon :icon="conquista.desbloqueada ? checkmarkCircleOutline : lockClosedOutline" />
              </div>

              <div class="achievement-info">
                <IonText>
                  <h3>{{ conquista.nome }}</h3>
                  <p>{{ conquista.descricao }}</p>
                </IonText>
                <IonBadge :color="conquista.desbloqueada ? 'success' : 'medium'">
                  {{ conquista.desbloqueada ? 'Desbloqueada' : 'Bloqueada' }}
                </IonBadge>
              </div>
            </div>

            <div v-if="conquista.desbloqueada" class="achievement-foot">
              <IonIcon :icon="sparklesOutline" />
              <span>Conquistada em {{ conquista.desbloqueadaEm }}</span>
            </div>
          </IonCardContent>
        </IonCard>
      </section>

      <IonCard>
        <IonCardContent>
          <IonText color="medium">
            <p>
              As conquistas são salvas no SQLite por usuário e são atualizadas automaticamente quando você coleta figurinhas.
            </p>
          </IonText>

          <IonButton expand="block" fill="outline" class="ion-margin-top" @click="atualizarConquistas">
            Atualizar conquistas
          </IonButton>
        </IonCardContent>
      </IonCard>
    </IonContent>
  </IonPage>
</template>

<style scoped>
.hero-card {
  background: linear-gradient(135deg, #111827 0%, #3b82f6 55%, #f59e0b 100%);
  color: #fff;
  border-radius: 20px;
}

.hero-stats {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;
}

.hero-stats h2 {
  margin: 4px 0 0;
  font-size: 2rem;
  font-weight: 800;
}

.conquistas-lista {
  display: grid;
  gap: 12px;
  margin-bottom: 16px;
}

.achievement-card {
  border-left: 4px solid rgba(148, 163, 184, 0.4);
}

.achievement-card.desbloqueada {
  border-left-color: var(--ion-color-warning);
  box-shadow: 0 8px 24px rgba(245, 158, 11, 0.08);
}

.achievement-head {
  display: flex;
  gap: 14px;
  align-items: flex-start;
}

.achievement-icon {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: rgba(148, 163, 184, 0.14);
  color: var(--ion-color-medium);
  flex: 0 0 auto;
}

.achievement-icon.desbloqueada {
  background: rgba(245, 158, 11, 0.16);
  color: var(--ion-color-warning);
}

.achievement-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.achievement-info h3 {
  margin: 0 0 4px;
  font-size: 1.05rem;
}

.achievement-info p,
.achievement-foot span {
  margin: 0;
  color: var(--ion-color-medium-shade);
}

.achievement-foot {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
  color: var(--ion-color-warning-shade);
}
</style>