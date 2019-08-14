import { Component, Listen, State, h } from '@stencil/core';

@Component({
  tag: 'app-update',
  styleUrl: 'app-update.css',
  shadow: true
})
export class AppUpdate {
  @State() visible: boolean = true;

  @Listen("swUpdate", { target: 'window' })
  async onSWUpdate() {
    const registration = await navigator.serviceWorker.getRegistration();

    if (!registration || !registration.waiting) {
      // If there is no registration, this is the first service
      // worker to be installed. registration.waiting is the one
      // waiting to be activiated.
      return;
    }

    this.visible = true;
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  }

  render() {
    return this.visible ? (
      <div class="app-update">
        <div class="holder" onClick={() => window.location.reload()}>
          <app-icon icon="exclamation-circle" />
          <div class="auto-return">
            <span>New content is available!</span>
            <span>Refresh or click to update.</span>
          </div>
        </div>
      </div>
    ) : null;
  }
}
