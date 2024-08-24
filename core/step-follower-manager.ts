import React, { InputHTMLAttributes } from "react";
import Joi, { isSchema } from "joi";
import { create } from "zustand";
import { combine } from "zustand/middleware";
import { produce } from "immer";


type StepFieldValidatorFn = (val: any) => boolean;
type StepFieldValidatorSchema = Joi.AnySchema;

type StepFieldValidator = StepFieldValidatorFn | StepFieldValidatorSchema;

interface StepUIStrings {
  title: string;
  description?: string;
}

interface StepDef<PossibleFields> {
  component: () => React.ReactNode,
  key: string;
  uiStrings: StepUIStrings;
  fields: Partial<Record<keyof PossibleFields, StepFieldValidator>>;
  skippable?: boolean;
}

// [Error 1, e1] - A component logic is independen of their step, so we cannot define individual behaviour for a component in a step
//      the more we can do is to share the global_state and allow a way to modify individual parts of it.
//      Internal logic for validations will take place when updating the global_state and navigation actions will react based on the result

// The general idea is to allow the user to create a controlled step wizzard based on a state
//      Define what validations apply for every field on the state and what step depends on what field to enable or isable navigation
//      In definition, a navigation based on state information



// Esto va a ser una aplicacion distinta. Vamos a dejar este step wizzard manager de lado, dejemos que se encargue de controlar solo la navegacion por ahora
// quizas luego ponga alguna clase interacion con el siguiente componente.


// Definicion general del sig componente -----
// Necesito una forma de definir un estado y definir validaciones para cada campo del estado 
// - obtener de vuelta formas de actualizar ese estado
// - ser notificado por errores al actualizar estos valores (eg. password field should be greater than...)
// una referencia de una forma interesante de hacer esto es como formik lo hace


// 1 y 2 de aca creo que ya no importan a estas alturas, nos estamos deshaciendo de cualquier cosa que tenga que ver con manejo de estado dentro de StepFollower
// la razon es la parte de "state based navigation" está genial, pero eso nos fuerza a que los componentes inyectados dependen de este estado.
// Es mejor que dichos componentes manejen su propio estado, validaciones, etc. Y este solo se encargue de la navegacion (terminamos haciendo un simple step controller)
// Eventualmente consideraré una forma de integrar validaciones desde los hooks que exporta este factory. Así no importa que componente se pase ni en que etapa se pase,
//      el mismo componente se encargara de la logica de su estado y como validarlo
interface CreateStepFollowerOptions<T> {
  // 2
  // Entonces en step el campo fields seria un array que contenga las keyof T
  // entonces fields ahora solo pasará a significar que campos son requeridos del estado global para esa etapa
  // de esta forma cubrimos
  // - Validaciones automáticas para navegación
  // - A global state that can be consumed everywhere if needed
  // - We no longer need to discover how to extract partial state for every steps depending on their definition [e1] 
  steps: [StepDef<T>, ...StepDef<T>[]],
  // 1
  // La idea es hacer que initialState tambien contenga las validaciones para cada field del estado.
  // hacer el estado global y dejar que cada estep acceda a dicho estad, así como también actualizar dicho estado
  initialState: T;
}

interface StepFollowerState<T> {
  currentIndex: number;
  maxIndex: number;
  stateData: Array<Record<string, Record<string, any>>>;
  state: T;
}

interface StepFollowerActions<T> {
  next: () => any;
  prev: () => any;
  setFieldValue: (id: string, value: string | number | boolean) => any,
  setState: (s: Partial<T>) => any;
  restoreState: () => any;
}

type StepFollowerStore<T> =  StepFollowerActions<T> & StepFollowerState<T>;

export function createStepFollower<State>(config: CreateStepFollowerOptions<State>) {
  const { steps, initialState } = Object.freeze(config);
  const stepsLen = steps.length;

  if (stepsLen < 1) throw new Error('Should define at least one step');

  const useStepStore = create<StepFollowerStore<State>>(set => ({
    currentIndex: 0,
    maxIndex: stepsLen - 1,
    stateData: steps.map(s => {
      return Object.keys(s.fields).reduce<Record<string, any>>((acc, f) => (acc[f] = '', acc), {});
    }),
    components: steps.map(s => s.component),
    state: initialState,
    // ------------------------------------------- ACTIONS
    next: () => set((s) => {
      if (s.currentIndex + 1 > s.maxIndex) return s;
      return { currentIndex: s.currentIndex + 1 };
    }),
    prev: () => set((s)=> {
      if (s.currentIndex - 1 < 0) return s;
      return { currentIndex: s.currentIndex - 1 };
    }),
    setFieldValue: (id: string, val: any) => set(s => {
      return produce(s, (mutable) => {
        mutable.stateData[s.currentIndex][id] = val;
      });
    }),
    setState: (newState) => set(s => ({
      state: { ...s.state, ...newState },
    })),
    restoreState: () => set({ state: initialState }),
  }));

  const useStepFollower = () => {
    const currentIndex = useStepStore(s => s.currentIndex);
    const stepDef = React.useMemo(() => steps[currentIndex], [currentIndex]);

    const Component = React.useCallback((props: React.Attributes & Record<string, any>) => {
      return React.createElement(
        stepDef.component,
        { ...props },
      );
    }, [stepDef.component]);

    return {
      currentIndex,
      steps,
      Component,
    };
  }

  const useActions = () => {
    const {
      next,
      prev,
    } = useStepStore();

    const currentIndex = useStepStore(s => s.currentIndex);
    const maxIndex = useStepStore(s => s.maxIndex);

    const canGoNext = false || currentIndex < maxIndex;
    const canGoPrev = false || currentIndex > 0;

    const goNext = () => {
      console.log('Going next');
      next();
    }

    const goPrev = () => {
      console.log('Going prev');
      prev();
    }

    return {
      canGoPrev,
      canGoNext,
      goNext,
      goPrev,
    };
  }

  // Ref: https://chatgpt.com/c/7c8e2313-d2b5-4a3a-95c2-a7f99ae9ac5d

  // Actualmente esta cosa no está funcionando por el simple hecho de que es una función normal
  // depende de que alguien más haga actualizaciones del estado para realizar re-renders y poder cachar los valores onChange y value en tiempo real
  // TODO: Convertir a un hook normal para realziar actualizaciones ese acá o buscar una alternativa para settear y validar valores del estado
  const registerField = (fieldId: string): InputHTMLAttributes<any> => {
    const { currentIndex, setFieldValue } = useStepStore.getState();
    const stateData = useStepStore.subscribe(s => s.stateData);

    return {
      onChange: (e) => {
        const value = e.target.value || '';
        setFieldValue(fieldId, value);
      },
      value: stateData[currentIndex][fieldId] || '',
    };
  };

  const useStepState = () => {
    const currentIndex = useStepStore(s => s.currentIndex);
    const stateData = useStepStore(s => s.stateData);
    return stateData[currentIndex];
  }

  const useStepInfo = <T>() => {
    const currentIndex = useStepStore(s => s.currentIndex);
    const stepDef = steps[currentIndex];

    return React.useMemo(() => {
      return Object.freeze({
        currentIndex,
        stepKey: stepDef.key,
        // Need to extract those in a way we know the types on them
        fieldNames: Object.keys(stepDef.fields),
        fields: stepDef.fields,
        strings: stepDef.uiStrings,
      });
    }, [stepDef, currentIndex]);
  }

  return {
    useStepFollower,
    registerField,
    useActions,
    useStepState,
    useStepInfo
  };
}

function currentStepFieldsResolutor<T>(stepDef: StepDef<T>, componentState: Record<string, any>): boolean {
  const stepFields = Object.entries(stepDef.fields);
  const allFieldsValid = stepFields.every(([fieldKey, validator]) => {
    const stateValue = componentState[fieldKey];

    if (typeof validator === 'function') {
      const validatorFnResult = validator(stateValue);
      console.log({
        validatorFnResult,
        stateValue,
      });
      
      return validatorFnResult;
    }

    if(isSchema(validator)) {
      const joiValidationResult = validator.validate(stateValue);
      console.log({
        joiValidationResult,
        stateValue,
      });
  
      return joiValidationResult;
    }

    return true;
  });
  return allFieldsValid;
}
