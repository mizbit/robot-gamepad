#include <stdlib.h>
#include "common/cs_dbg.h"

#include "mgos_app.h"
#include "mgos_dns_sd.h"
#include "mgos_event.h"
#include "mgos_net.h"
#include "mgos_arduino_ssd1306.h"
#include "mgos.h"
#include "mgos_gpio.h"

#ifdef __cplusplus
extern "C" {
#endif

void *atob(unsigned char *data, int inputLength) {
  void *result;
  int outputLength = ((inputLength)/4)*3;

  result = (void *) calloc(outputLength + 1, 1);
  cs_base64_decode(data, inputLength, (char *)result, NULL);
  return result;
}
  
void ssd1306_splash(Adafruit_SSD1306 *ssd, void *data) {
  if (ssd == nullptr) return;
  uint8_t * data_c = reinterpret_cast<uint8_t *>(data);
  int h = mgos_ssd1306_height(ssd);
  int w = mgos_ssd1306_width(ssd);
  ssd->drawBitmap(0, 0, data_c, w, h, WHITE);
}

void ssd1306_drawBitmap(Adafruit_SSD1306 *ssd, void *data, int x, int y, int w, int h) {
  if (ssd == nullptr) return;
  uint8_t * data_c = reinterpret_cast<uint8_t *>(data);
  ssd->drawBitmap(x, y, data_c, w, h, WHITE);
}

static void net_ev_handler(int ev, void *ev_data, void *arg) {
  if (ev != MGOS_NET_EV_IP_ACQUIRED) return;
  LOG(LL_INFO, ("==="));
  LOG(LL_INFO, ("=== Navigate to http://%s/ in your browser",
                mgos_dns_sd_get_host_name()));
  LOG(LL_INFO, ("==="));
  (void) ev_data;
  (void) arg;
}

enum mgos_app_init_result mgos_app_init(void) {
  mgos_event_add_group_handler(MGOS_EVENT_GRP_NET, net_ev_handler, NULL);
  return MGOS_APP_INIT_SUCCESS;
}

#ifdef __cplusplus
}
#endif
