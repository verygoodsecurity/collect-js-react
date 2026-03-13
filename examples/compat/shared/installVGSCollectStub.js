function createSecureField(wrapper, fieldOptions) {
  const iframe = document.createElement('iframe');
  const fieldName = fieldOptions?.name || 'unnamed-field';

  iframe.src = 'about:blank';
  iframe.title = `VGS Collect field ${fieldName}`;
  iframe.dataset.vgsCollectName = fieldName;
  iframe.dataset.vgsCollectReady = 'true';
  iframe.setAttribute('aria-label', `VGS Collect field ${fieldName}`);

  wrapper.replaceChildren(iframe);

  return {
    on() {},
    off() {},
    delete() {
      iframe.remove();
    }
  };
}

export function installVGSCollectStub() {
  if (typeof window === 'undefined') {
    return;
  }

  if (window.VGSCollect && window.VGSCollect.__compatStub === true) {
    return;
  }

  window.VGSCollect = {
    __compatStub: true,
    create(vaultId, environment, stateCallback) {
      const mountedFields = new Set();

      stateCallback?.({
        vaultId,
        environment,
        isValid: false,
        isDirty: false,
        isTouched: false,
        fields: {}
      });

      return {
        field(selector, fieldOptions) {
          const wrapper = document.querySelector(selector);

          if (!(wrapper instanceof HTMLElement)) {
            throw new Error(`VGS Collect stub could not find wrapper: ${selector}`);
          }

          const secureField = createSecureField(wrapper, fieldOptions);
          mountedFields.add(secureField);

          return secureField;
        },
        useCname() {},
        setRouteId() {},
        submit() {},
        tokenize() {},
        createCard() {},
        unmount() {
          mountedFields.forEach((secureField) => {
            secureField.delete();
          });
          mountedFields.clear();
        }
      };
    }
  };
}

installVGSCollectStub();
